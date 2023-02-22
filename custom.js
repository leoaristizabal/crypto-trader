const form = document.querySelector("#form-search");
const moneda = document.querySelector("#moneda");
const criptomoneda = document.querySelector("#criptomonedas");
const formContainer = document.querySelector(".form-side");
const ContainerAnswer = document.querySelector(".container-answer");

const objBusqueda = {
    moneda: '',
    criptomoneda:''
}

document.addEventListener('DOMContentLoaded', ()=>{
    consultarCriptos();

    form.addEventListener('submit',submitForm);
    moneda.addEventListener('change', getValue);
    criptomoneda.addEventListener('change', getValue);
})

function submitForm(e){
    e.preventDefault();
    const {moneda, criptomoneda} = objBusqueda
    if(moneda === '' || criptomoneda ===''){
        showError('Seleccione ambas monedas...');
    }
    consultarAPI(moneda,criptomoneda);
    //  console.log(moneda);
    //  console.log(criptomoneda);
}

function consultarAPI(moneda,criptomoneda){
    const url = `https://min-api.cryptocompare.com/data/pricemultifull?fsyms=${criptomoneda}&tsyms=${moneda}`
    fetch(url)
        .then(resultado=> resultado.json())
        .then(resultadoJson => {
            mostrarCotizacion(resultadoJson.DISPLAY[criptomoneda][moneda]);
            console.log(resultadoJson.DISPLAY[criptomoneda][moneda]);
        })
        .catch(error => console.log(error));
}

function mostrarCotizacion(data){
    clearHTML();
    const{PRICE,HIGHDAY,LOWDAY, CHANGEPCT24HOUR,LASTUPDATE} = data;
    const answer = document.createElement('div');
    answer.classList.add('display-info');
    answer.innerHTML = `
        <p class="main-price">Precio: <span>${PRICE}</span></p>
        <p>Precio mas alto del dia: <span>${HIGHDAY}</span></p>
        <p>Precio mas bajo del dia: <span>${LOWDAY}</span></p>
        <p> Variacion ultimas 24 horas: <span>${CHANGEPCT24HOUR}%</span></p>
        <p>Ultima Actualizacion: <span>${LASTUPDATE}</span></p>
        `;
        ContainerAnswer.appendChild(answer);
}

function showError(mensage){
    const error = document.createElement('p');
    error.classList.add("error");
    error.textContent = mensage;
    formContainer.appendChild(error);
    setTimeout(() => error.remove(), 3000);
}

function getValue(e){
    objBusqueda[e.target.name] = e.target.value;
    console.log(e.target.value);
    console.log(e.target.name);
}


function consultarCriptos(){
    const url = 'https://min-api.cryptocompare.com/data/top/mktcapfull?limit=10&tsym=USD';

    fetch(url)
        .then(respuesta => respuesta.json())
        .then(respuestaJson=>{
            selectCriptos(respuestaJson.Data);
            //console.log(respuestaJson.Data);
        })
        .catch(error => console.log(error));
}

function selectCriptos(criptos){
    criptos.forEach(cripto => {
        const{FullName,Name} = cripto.CoinInfo;
        const option = document.createElement("option");
        option.value = Name; 
        option.textContent = FullName;
        criptomoneda.appendChild(option);
    });
}

function clearHTML(){
    ContainerAnswer.innerHTML = '';
}