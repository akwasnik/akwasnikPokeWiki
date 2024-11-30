'use strict'

const pokemonListUrl = "https://pokeapi.co/api/v2/pokemon";

const getPokemonUrl = (pokemonId) => `https://pokeapi.co/api/v2/pokemon/${pokemonId}`


var detailsSection = document.getElementById("pokemon-details");
const dataContainer = document.getElementById("data-container");
const detailsContainer = document.getElementById("details-container")
const detailsContainer_types = document.getElementById("details-container__types")
const detailsContainer_stats = document.getElementById("details-container__stats")

detailsSection.style.visibility = 'hidden'
detailsContainer.style.visibility = 'hidden'

async function fetchPokemonList(){
    try{
        const response = await fetch(pokemonListUrl);

        if(!response.ok){
            throw new Error(`ERROR CODE : ${response.status}`);
        }

        const pokemonList = await response.json();

        displayList(pokemonList.results);
        
        

    }catch(error){
        document.body.innerHTML = `
            <div class="fetch--error">
                <img src="/src/assets/images/error-pokeball.png" alt="" width="100" height="100">
                <h1>${error.message}</h1>
                <img src="/src/assets/images/error.png" alt="" width="100" height="100">
            </div>
        `;
    }
}



async function fetchPokemonDetails(url){
    try{
        const response = await fetch(url);

        if(!response.ok){
            throw new Error(`ERROR CODE : ${response.status}`);
        }

        const pokemonDetails = await response.json();

        displayPokemonDetails(pokemonDetails)
        
        

    }catch(error){
        detailsContainer.innerHTML = `
            <div class="fetch--error">
                <img src="/src/assets/images/error-pokeball.png" alt="" width="100" height="100">
                <h1>${error.message}</h1>
                <img src="/src/assets/images/error.png" alt="" width="100" height="100">
            </div>
        `
    }
}

function displayList(data){
    dataContainer.innerHTML = '';

    data.forEach(pokemon => {
        const pokemonId = pokemon.url.split('/')[6];
        const pokemonUrl = getPokemonUrl(pokemonId);

        const div = document.createElement('div');
        div.className = `data-container__item ${pokemon.name}`;
        div.innerHTML = `
            <h2>${pokemon.name}</h2>
            <img src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${pokemonId}.png">
            <p>Number: ${pokemonId}</p>
        `;

        div.addEventListener('click',() => {
            fetchPokemonDetails(pokemonUrl);
        });

        dataContainer.appendChild(div);
    });
}


function displayPokemonDetails(pokemonDetails){
    detailsContainer.style.visibility = 'visible'
    detailsSection.style.visibility = 'visible'
    detailsContainer_types.innerHTML = '';
    detailsContainer_stats.innerHTML = '';
    detailsContainer.removeChild(detailsContainer.firstChild)


    const detailsContainer_data = document.createElement('div');
    detailsContainer_data.className = `details-container__main`
    detailsContainer_data.innerHTML=`
        <h1>${pokemonDetails.name}</h1>
        <img src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${pokemonDetails.id}.png" height=200 width=200>
    `;

    detailsContainer.insertBefore(detailsContainer_data,detailsContainer_types)


    pokemonDetails.types.forEach(type => {
        const spriteId = type.type.url.split('/')[6];
        const detailsContainer_type = document.createElement('div');
        detailsContainer_type.className = `details-container__types__item`

        detailsContainer_type.innerHTML = `
        <img src="https://raw.githubusercontent.com/PokeAPI/sprites/refs/heads/master/sprites/types/generation-viii/brilliant-diamond-and-shining-pearl/${spriteId}.png">
        `
        
        detailsContainer_types.appendChild(detailsContainer_type)
    });
    
    pokemonDetails.stats.forEach(stat => {
        const detailsContainer_stat = document.createElement('li');
        detailsContainer_stat.className = 'details-container__stats__item'
        detailsContainer_stat.innerText = `${stat.stat.name}: ${stat.base_stat+stat.effort}`
        
        detailsContainer_stats.appendChild(detailsContainer_stat)
    });


}

document.getElementById('search-form').addEventListener('submit', (event) => {
    event.preventDefault();

    const pokemonName = document.getElementById('search-input').value;
    if (pokemonName) {
        fetchPokemonDetails(getPokemonUrl(pokemonName));
    } else {
        alert("No pokemon name given...")
    }
});



fetchPokemonList()