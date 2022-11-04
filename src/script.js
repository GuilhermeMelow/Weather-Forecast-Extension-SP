const previsoesElement = document.getElementById('previsoes');
const previsaoDia = [];
let previsaoAtual = undefined;

window.onload = async () => {
    const json = await requestPrevisoes();
    const results = Object.entries(json['3550308']);
    const primeiroResultado = results[0];
    const previsaoDoTempo = primeiroResultado[1];

    const previsoesDivs = Object.entries(previsaoDoTempo).map(p => {
        return createPrevisaoDiv({ horario: p[0], previsaoData: p[1] });
    });

    previsaoDia.push(...previsoesDivs);
    previsoesElement.appendChild(previsaoDia[0]);
    previsaoAtual = previsaoDia[0];
}


const nextButton = document.querySelector('.carousel-control-next');
nextButton.onload = () => {
    const index = previsaoDia.findIndex(c => c === previsaoAtual);

    showButtons(index);
}
nextButton.onclick = () => {
    if (!previsaoAtual) return;

    const index = previsaoDia.findIndex(c => c === previsaoAtual) + 1;

    previsoesElement.removeChild(previsaoAtual);
    previsoesElement.appendChild(previsaoDia[index]);
    previsaoAtual = previsaoDia[index];

    nextButton.dispatchEvent(new Event('load'));
}

const previousButton = document.querySelector('.carousel-control-prev');
previousButton.onload = () => {
    const index = previsaoDia.findIndex(c => c === previsaoAtual);

    showButtons(index);
}
previousButton.onclick = () => {
    if (!previsaoAtual) return;

    const index = previsaoDia.findIndex(c => c === previsaoAtual) - 1;

    previsoesElement.removeChild(previsaoAtual);
    previsoesElement.appendChild(previsaoDia[index]);
    previsaoAtual = previsaoDia[index];

    previousButton.dispatchEvent(new Event('load'));
}

function showButtons (index) {
    if (index < previsaoDia.length)
        nextButton.classList.replace('d-none', 'd-block');

    if (index >= previsaoDia.length)
        nextButton.classList.replace('d-block', 'd-none');

    if (index > 0)
        previousButton.classList.replace('d-none', 'd-block');

    if (index === 0)
        previousButton.classList.replace('d-block', 'd-none');
}

async function requestPrevisoes () {
    const PREVISAO_CACHE_KEY = 'previsaoCache';
    const previsaoCached = localStorage.getItem(PREVISAO_CACHE_KEY);

    if (previsaoCached) return JSON.parse(previsaoCached);

    const result = await fetch('https://apiprevmet3.inmet.gov.br/previsao/3550308');
    const resultJson = await result.json();

    localStorage.setItem(PREVISAO_CACHE_KEY, JSON.stringify(resultJson));

    return resultJson;
}

function createPrevisaoDiv ({ horario, previsaoData }) {
    const horarioElement = document.createElement('p');
    horarioElement.textContent = horariosMapper[horario];

    const temperaturaDiv = document.createElement('div');

    const temperaturaMaximaElement = createTemperaturaParagrafo(`Temperatura máxima: ${previsaoData['temp_max']}`);
    temperaturaDiv.appendChild(temperaturaMaximaElement);

    const temperaturaMinimaElement = createTemperaturaParagrafo(`Temperatura mínima: ${previsaoData['temp_min']}`);
    temperaturaDiv.appendChild(temperaturaMinimaElement);

    const temperaturaDescricaoElement = createTemperaturaParagrafo(`Descrição: ${previsaoData['resumo']}`);
    temperaturaDiv.appendChild(temperaturaDescricaoElement);

    const icon = document.createElement('img');
    icon.setAttribute('src', previsaoData['icone']);

    const previsaoDiv = document.createElement('div');
    previsaoDiv.classList.add('my-2', 'text-center');
    previsaoDiv.append(horarioElement, icon, temperaturaDiv);

    return previsaoDiv;
}

function createTemperaturaParagrafo (text) {
    const result = document.createElement('p');
    result.textContent = text;

    return result;
}

const horariosMapper = {
    "manha": "Manhã",
    "tarde": "Tarde",
    "noite": "Noite"
};