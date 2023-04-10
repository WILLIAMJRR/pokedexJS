document.addEventListener('DOMContentLoaded', () => {
    //SELECTORES
    const pokemonContainer = document.querySelector('.pokemon_container');
    const pokemonInput = document.querySelector('.pokemon_name');
    const pokemonForm = document.querySelector('.pokemon_form');
    const suggestionsContainer = document.querySelector(
        '.suggestions_container',
    );
    const spinner = document.querySelector('#spinner');
    const previous = document.getElementById('previous');
    const next = document.getElementById('next');

    //VARIABLES

    let firstIndex = 1;
    let lastIndex = 8;
    let arrayPokemon = [];

    //EVENTOS

    pokemonForm.addEventListener('submit', (event) => {
        event.preventDefault();

        const pokemonName = pokemonInput.value.toLowerCase().trim();
        if (pokemonName === '' || pokemonName === '0') return; // no hacer nada si se envía un nombre vacío
        const existingCards = document.querySelectorAll('.flip-card');

        const copyexistingCards = [...existingCards];

        copyexistingCards.map((card) => card.remove());

        getPokemon(pokemonName);

        suggestionsContainer.innerHTML = '';
    });

    //buscar pokemon por sugerencia
    pokemonInput.addEventListener('input', async () => {
        const searchTerm = pokemonInput.value.trim().toLowerCase();

        if (searchTerm.length >= 1) {
            try {
                const url = `https://pokeapi.co/api/v2/pokemon?limit=1118`;

                const response = await fetch(url);

                const data = await response.json();

                const matchingPokemon = data.results.filter((pokemon) =>

                    pokemon.name.startsWith(searchTerm),
                );

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

    //selecciona al pokemon con el click en sugerencia
    suggestionsContainer.addEventListener('click', (event) => {
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
            firstIndex -= 8;
            getPokemons(firstIndex, lastIndex);
            removerElementosRepetidos(pokemonContainer);
        }
    });

    next.addEventListener('click', () => {
        if (firstIndex < arrayPokemon) {
            next.classList.add('btn_opacity');
        } else {
            firstIndex += 8;
            previous.classList.remove('btn_opacity');
            getPokemons(firstIndex, lastIndex);
            removerElementosRepetidos(pokemonContainer);
        }
    });

    //FUNCIONES

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

    const getPokemons = async (offset, limit) => {
        spinner.style.display = 'block';
        for (let i = offset; i <= offset + limit; i++) {
            arrayPokemon.push(i);
            await getPokemon(i);
        }
    };

    function removerElementosRepetidos(parent) {
        while (parent.firstChild) {
            parent.removeChild(parent.firstChild);
        }
    }
    const addOpacity = () => {
        const previous = document.getElementById('previous');
        previous.classList.add('btn_opacity');
    };

    function createPokemon(pokemon) {
        const pokemonContainer = document.querySelector('.pokemon_container');
        // ultimo paso para las card
        const flipCard = document.createElement('DIV');
        flipCard.classList.add('flip-card');

        const cardContainer = document.createElement('DIV');
        cardContainer.classList.add('card_container');

        // al flipCard se le agrega como hijo cardContainer
        flipCard.appendChild(cardContainer);

        // tarjeta que lo va a contener
        const card = document.createElement('DIV');
        card.classList.add('pokemon_card');

        // contenedor de la imagen
        const spriteContainer = document.createElement('DIV');
        spriteContainer.classList.add('img_container');
        //imagen
        const sprite = document.createElement('IMG');
        sprite.src = pokemon.sprites.other['official-artwork'].front_default;
        sprite.classList.add('pokemon_img');

        // se le agrea un nuevo hijo a spriteContainer
        spriteContainer.appendChild(sprite);

        // numero de pokemon
        const number = document.createElement('P');
        number.textContent = `#${pokemon.id.toString().padStart(3, 0)}`;
        number.classList.add('pokemon_number');

        // nombre del pokemon
        const name = document.createElement('H2');
        name.classList.add('name');
        name.textContent = pokemon.name;

        // parte de abajo de la card
        const divCard = document.createElement('DIV');
        divCard.classList.add('div_card');

        const containerInfo = document.createElement('DIV');
        containerInfo.classList.add('container_info');
        containerInfo.appendChild(name);
        containerInfo.appendChild(number);

        // agregaremos los elemntos a las cartas
        card.appendChild(spriteContainer);
        card.appendChild(containerInfo);
        card.appendChild(divCard);

        // parte de atras de la carta
        const cardBack = document.createElement('DIV');
        cardBack.classList.add('pokemon-block-back');

        cardBack.appendChild(progressBars(pokemon.stats));

        cardContainer.appendChild(card);
        cardContainer.appendChild(cardBack);

        // le vamos agregar la informacion a pokemonContainer que esta en el html
        pokemonContainer.appendChild(flipCard);
    }

    function progressBars(stats) {
        const statsContainer = document.createElement('div');
        statsContainer.classList.add('stats-container');

        for (let i = 0; i < 3; i++) {
            const stat = stats[i];

            const statPercent = stat.base_stat / 2 + '%';
            const statContainer = document.createElement('stat-container');
            statContainer.classList.add('stat-container');

            const statName = document.createElement('P');
            statName.textContent = stat.stat.name;

            const progress = document.createElement('DIV');
            progress.classList.add('progress');

            const progressBar = document.createElement('DIV');

            // clases de boostraps
            progressBar.classList.add('progress-bar');
            progressBar.setAttribute('aria-valuenow', stat.base_stat);
            progressBar.setAttribute('aria-valuemin', 0);
            progressBar.setAttribute('aria-valuemax', 200);
            progressBar.style.width = statPercent;

            progressBar.textContent = stat.base_stat;

            progress.appendChild(progressBar);
            statContainer.appendChild(statName);
            statContainer.appendChild(progress);

            statsContainer.appendChild(statContainer);
        }

        return statsContainer;
    }

    function btnButton() {
        const buttonBack = document.createElement('BUTTON');
        buttonBack.classList.add('btn_back');
        buttonBack.textContent = 'back';
        pokemonContainer.appendChild(buttonBack);
    }
    getPokemons(firstIndex, lastIndex);
    addOpacity();
});
