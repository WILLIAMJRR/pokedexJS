document.addEventListener('DOMContentLoaded', () => {

    // SELECTORES:
    const pokemonContainer = document.querySelector('.pokemon_container');
    const pokemonInput = document.querySelector('.pokemon_name');
    const pokemonForm = document.querySelector('.pokemon_form');
    const suggestionsContainer = document.querySelector('.suggestions_container');
    const spinner = document.querySelector('#spinner');
    const next = document.getElementById('next');
    const previous = document.getElementById('previous');

    // VARIABLES:
    let firstIndex = 1;
    let lastIndex = 9;
    let arrayPokemon = [];

    // EVENTOS:
    pokemonForm.addEventListener('submit', event => {
        event.preventDefault();
        const pokemonName = pokemonInput.value.toLowerCase().trim();
        if (pokemonName === '' || pokemonName === '0') return;
        const existingCards = document.querySelectorAll('.flip-card');
        const copyexistingCards = [...existingCards];
        copyexistingCards.map((card) => card.remove());
        getPokemon(pokemonName);
        suggestionsContainer.innerHTML = '';
    });

    pokemonInput.addEventListener('input', async () => {
        const searchTerm = pokemonInput.value.trim().toLowerCase();
        if (searchTerm.length >= 1) {
            try {
                const url = `https://pokeapi.co/api/v2/pokemon?limit=1118`;
                const response = await fetch(url);
                const data = await response.json();
                const matchingPokemon = data.results.filter((pokemon) => pokemon.name.startsWith(searchTerm), );
                suggestionsContainer.innerHTML = '';
                const fragment = document.createDocumentFragment();
                matchingPokemon.map((pokemon) => {
                    const suggestion = document.createElement('DIV');
                    suggestion.classList.add('suggestion');
                    suggestion.textContent = pokemon.name;
                    fragment.appendChild(suggestion);
                });
                suggestionsContainer.appendChild(fragment);
            } catch (err) {
                console.error(err);
            }
        } else {
            suggestionsContainer.innerHTML = '';
        }
    });

    suggestionsContainer.addEventListener('click', event => {
        const clickedSuggestion = event.target;
        if (!clickedSuggestion.classList.contains('suggestion')) return;
        const existingCards = document.querySelectorAll('.flip-card');
        const copyexistingCards = [...existingCards];
        copyexistingCards.map((card) => card.remove());
        const selectedPokemon = clickedSuggestion.innerText;
        getPokemon(selectedPokemon);
        suggestionsContainer.innerHTML = '';
    });

    previous.addEventListener('click', () => {
        if (firstIndex <= 1) {
            addOpacity();
        } else {
            firstIndex -= 10;
            getPokemons(firstIndex, lastIndex);
            removerElementosRepetidos(pokemonContainer);
        }
    });

    next.addEventListener('click', () => {
        if (firstIndex < arrayPokemon) {
            next.classList.add('btn_opacity');
        } else {
            firstIndex += 10;
            previous.classList.remove('btn_opacity');
            getPokemons(firstIndex, lastIndex);
            removerElementosRepetidos(pokemonContainer);
        }
    });

    // FUNCIONES:
    const getPokemons = (offset, limit) => {
        spinner.style.display = 'block';
        for (let i = offset; i <= offset + limit; i++) {
            arrayPokemon.push(i);
            getPokemon(i);
        }
    };

    function removerElementosRepetidos(parent) {
        while (parent.firstChild) {
            parent.removeChild(parent.firstChild);
        }
    }

    async function getPokemon(pokemonName) {
        const url = `https://pokeapi.co/api/v2/pokemon/${pokemonName}/`;

        try {
            const res = await fetch(url);
            const data = await res.json();
            createPokemon(data);
            pokemonForm.reset();
            spinner.style.display = 'none';
        } catch (err) {
            console.log(err);
        }
    }

    function addOpacity() {
        const previous = document.getElementById('previous');
        previous.classList.add('btn_opacity');
    }

    function createPokemon(pokemon) {

        // crear elementos
        const flipCard = document.createElement 
