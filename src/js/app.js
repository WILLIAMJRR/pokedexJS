document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('pokemon-form');
    const input = document.getElementById('pokemon-name');
    const pokemonData = document.getElementById('pokemon-data');


const getPokemon = async (pokemonName, modal) =>{
    const url = `https://pokeapi.co/api/v2/pokemon/${pokemonName}`;
    const rest = await fetch(url);
    const pokemon = await rest.json();
    console.log(pokemon.results)
   renderPokemonInfo(pokemon, modal);
}

    //evento en el formulario
    form.addEventListener('submit', (event) => {
        event.preventDefault(); // evitar recarga por defecto de la página
        const pokemonName = input.value.toLowerCase().trim();

        // if (pokemonName === '') return; // no hacer nada si se envía un nombre vacío

      getPokemon(pokemonName)
    });
    function renderPokemonInfo(pokemon) {
        // crear elementos HTML con la información del pokemon
        const name = document.createElement('h2');
        name.textContent = pokemon.name;
        name.classList.add('card_nombre');
        const sprite = document.createElement('img');
        sprite.src = pokemon.sprites.front_default;
        sprite.classList.add('card_img');

        // mostrar los elementos en la página
        pokemonData.appendChild(name);
        pokemonData.appendChild(sprite);

        //reiniciar el formulario
        form.reset();
    }

    const obtenerTodosLosPokemon = async (id) => {
        try {
            const respuesta = await fetch('https://pokeapi.co/api/v2/pokemon/');
            const data = await respuesta.json();
            console.log(data.results);
        } catch (error) {
            console.error(error);
        }
    };
});


//otro resultado
// Variables globales
const pokeContent = document.getElementById('pokemonContent');
const divGeneration = document.getElementById('textGen');

/* Funciones */
// Esta función muestra qué Pokémon pertenecen a una generación específica.
const getPokemonByGeneration = (gen) => {
    const pokemonGen = {
        1: [1, 151],
        2: [152, 251],
        3: [252, 386]
    }; // Se especifican las distintas generaciones de Pokemon

    const defaultGen = [1, 151];
    const pokemonIDs = pokemonGen[gen] || defaultGen;
    return pokemonIDs;
};

// Esta función muestra cada Pokemon con su respectiva tarjeta de información.
const drawPokemonCards = async () => {
    pokeContent.innerHTML = ''; // Eliminar todo el contenido HTML dentro del contenedor
    const pokemonIDs = getPokemonByGeneration(generationshow);
    for (let i = pokemonIDs[0]; i <= pokemonIDs[1]; i++) {
        await getPokemonData(i); //Obtener datos de cada Pokemon en paralelo para evitar conflictos
    }
};

// Esta función busca un Pokemon en particular e imprime su información en una "tarjeta" aparte.
const searchAndGetPokemon = async () => {
    const searchTerm = document.getElementById('pokemon').value.toLowerCase();
    if (searchTerm !== '') {
        await getPokemonData(searchTerm, true);
    }
};

// Esta función obtiene los datos de cada Pokemon, utilizando su ID o su nombre (en caso de que sea una búsqueda).
const getPokemonData = async (idOrName, modal = false) => {
    let url = '';
    if (!isNaN(idOrName)) { // Si el id no es un número, la búsqueda se realiza por nombre
        url = `https://pokeapi.co/api/v2/pokemon/${idOrName}`;
    } else {
        url = `https://pokeapi.co/api/v2/pokemon/${idOrName.toLowerCase()}`;
    }
    const request = await fetch(url);
    const pokemonData = await request.json();
    createPokemonCard(pokemonData, modal);
};

// Esta función crea una "tarjeta" de información para cada Pokemon.
const createPokemonCard = (pokemonData, isModal = false) => {
    const pokeTypes = pokemonData.types.map(type => type.type.name);
    const cardColor = colors[pokeTypes[0]] || colors['normal'];
    const name = pokemonData.name.toUpperCase();

    const pokemonEl = document.createElement('div');
    pokemonEl.classList.add('pokemon');

    pokemonEl.style.backgroundColor = cardColor;

    const pokemonHTML = `
        <div class="img-container">
            <img src="https://pokeres.bastionbot.org/images/pokemon/${pokemonData.id}.png" alt="${name}">
        </div>
        <div class="info">
            <span class="number">#${pokemonData.id.toString().padStart(3, '0')}</span>
            <h3 class="name">${name}</h3>
            <small class="type">Tipo: <span>${pokeTypes.join(', ')}</span></small>
        </div>`;

    if (isModal) { // Si es una búsqueda, se abre una "tarjeta" adicional con la información del Pokemon.
        const modalHTML = `<div class="modal" id="modalPokemon">
                            <div class="pokemon">${pokemonHTML}</div>
                          </div>`;
        pokeContent.innerHTML = modalHTML;
    } else { // Si no, simplemente se agrega el elemento HTML creado al contenedor principal.
        pokemonEl.innerHTML = pokemonHTML;
        pokeContent.appendChild(pokemonEl);
    }
};

/* Eventos */
// Este evento cambia la generación de los Pokemon a mostrar.
const arrowRight = document.getElementById('arrow-right')
    .addEventListener('click', () => {
        if (generationshow < 3) { // Si no llega al final de las generaciones
            generationshow++;
            divGeneration.innerHTML = `Gen ${generationshow}`; // Actualiza el número de generación
            drawPokemonCards(); // Vuelve a imprimir todas las tarjetas Pokemon en la lista
        }
    });

// Este evento cambia la generación de los Pokemon a mostrar.
const arrowLeft = document.getElementById('arrow-left') 


// paginacion
   //paginacion
    const gen = document.getElementById('textGen');
    let generationShow = 1;

// Esta función muestra qué Pokémon pertenecen a una generación específica por generacion
    // const getPokemonByGeneration = (gen) => {
    //     const pokemonGen = {
    //         1: [1, 100],
    //         2: [101, 202],
    //         3: [203, 304],
    //         4: [305, 406],
    //         5: [407, 508],
    //         6: [509, 610],
    //         7: [611, 712],
    //         8: [713, 814],
    //         9: [815, 916],
    //         10: [917, 1008],
    //         11: [1009, 1110],
    //         12: [1211, 1313],
    //     }; //se espesifican cada cuanto estaran por paginas

    //     const defaultGen = [1, 100];
    //     const pokemonIds = pokemonGen[gen] || defaultGen;
    //     return pokemonIds;
    // };

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
            sprite.src =
                pokemon.sprites.other['official-artwork'].front_default;
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
        
        function modal() {
            // crear elementos HTML con la información del pokemon
            const name = document.createElement('h2');
            name.textContent = pokemon.name;
            name.classList.add('card_nombre');
            const sprite = document.createElement('img');
            sprite.src = pokemon.sprites.front_default;
            sprite.classList.add('card_img');

            // mostrar los elementos en la página
            pokemonData.appendChild(name);
            pokemonData.appendChild(sprite);
        }
        console.log(pokemon);
        if (isModal) {
            modal();
        } else {
            containerPokemon();
        }