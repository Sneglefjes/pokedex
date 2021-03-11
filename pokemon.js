
const pokedex = document.getElementById('pokedex');
const mainContent = document.getElementById('main-content');
const searchBtn = document.getElementById('search');
var pokeballs;


searchBtn.addEventListener('click', (e) => {
    let num = document.getElementById('number').value;
    getPokemon(num)
    .then(result => {
        makePopup(result);
    }); 
})

async function getPokemonApi(number) {
    let fetchPokemons = await fetch(`https://pokeapi.co/api/v2/pokemon/?offset=0&limit=${number}`);
    let processed = await fetchPokemons.json();
    let pokemons = processed.results;
    return pokemons
}

async function getPokemon(id) {
    let fetchPokemon = await fetch(`https://pokeapi.co/api/v2/pokemon/${id}`);
    let processed = await fetchPokemon.json();
    console.log(processed)
    let pokemons = processed;
    return pokemons
}

getPokemonApi(150)
.then((pokemons) => {
    let pokemonPromises = pokemons.map((pokemon) => fetch((pokemon.url.slice(0, -1))).then(result => result.json()));
    return Promise.all(pokemonPromises);
})
.then(pokemons =>  {
    pokemons.forEach((pokemon => {
        makePokemon(pokemon);
    }))
    return pokemons;
})
.then(result => console.log(result))
.then(makeClickable)




function makePokemon(pokemon) {
    let element = document.createElement('div');
    element.classList.add('pokemon', pokemon.id);
    pokedex.appendChild(element);

    let image = document.createElement('div');
    image.innerHTML = `<img src="${pokemon.sprites.front_default}" alt="${pokemon.name}">`
    let name = document.createElement('span');
    element.appendChild(image);
    element.appendChild(name);
    
    let styleName = `${capitalize(pokemon.name)} ${styleId(pokemon.id)}`;
    let text = document.createElement('p')
    text.innerText = styleName
    name.appendChild(text);
}


function makeClickable() {
    pokeballs = Array.from(document.getElementsByClassName('pokemon'));
    pokeballs.forEach(element => {
        makeListener(element);
        
    })
    
}

function makeListener(element) {
    element.addEventListener('click', (e) => {
        getPokemon(e.currentTarget.classList[1])
        .then(result => {
            makePopup(result);
        });
    })
}

function makePopup(pokemon) {
    const popUp = document.createElement('div');
    popUp.setAttribute('id', 'popup');
    mainContent.appendChild(popUp);
    let name = makeElement(capitalize(pokemon.name), 'H1');
    let height = makeElement(`Height: ${pokemon.height}`, 'p')
    let weight = makeElement(`Weight: ${pokemon.weight}`, 'p')
    popUp.appendChild(name);
    popUp.appendChild(height);
    popUp.appendChild(weight);
    let photo = makeElement(`<img src="${pokemon.sprites.other['official-artwork'].front_default}" alt="${pokemon.name}">`, 'DIV')
    popUp.appendChild(photo);
    popUp.addEventListener('click', (e) => {
        popUp.remove();
        console.log(e);
    });
    // popUp.innerHTML = `<img src="${pokemon.sprites.other['official-artwork'].front_default}" alt="${pokemon.name}">`;
}

function removeElement(element) {
    element.remove();
}
function makeContainer() {
    const container = document.createElement('DIV');
    container.setAttribute('id', 'container');
    return container;
}

function makeElement(string, type) {
    const element = document.createElement(type);
    element.innerHTML = string;
    return element;
}


function capitalize(str) {
    return str[0].toUpperCase() + str.slice(1);
}

function styleId(num) {
    id = num.toString().split('')
    for (let i = 0; id.length < 3; i++) {
        id.unshift('0'); 
    }
    return '#' + id.join('');
}