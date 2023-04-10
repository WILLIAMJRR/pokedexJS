document.addEventListener('DOMContentLoaded', () => {
    const pokemonContainer = document.querySelector('.pokemon_container');
    const pokemonInput = document.querySelector('.pokemon_name');
    const pokemonForm = document.querySelector('.pokemon_form');
    const pokemonData = document.querySelector('.pokemon-data');
    const spinner = document.querySelector('#spinner');

    //Esta función recibe como parámetros el nombre del pokemon que se va a obtener y un valor booleano opcional para indicar si se desea mostrar una ventana modal con información adicional sobre el pokemon
    const getPokemon = (pokemonName) => {
        let url = '';

        //Se utiliza isNaN para determinar si el parámetro pasado es un número o no. Si devuelve true, significa que NO es un número.
        if (isNaN(pokemonName)) {
            //Si el parámetro NO es un número, se construye la URL de la API con el nombre del pokemon pasado en minúsculas y eliminando los espacios en blanco al principio y final con .trim()
            url = `https://pokeapi.co/api/v2/pokemon/${pokemonName}/`;
        } else {
            //Si el parámetro es un número, se construye la URL de la API utilizando dicho número como identificador del pokemon
            url = `https://pokeapi.co/api/v2/pokemon/${pokemonName}/`;
        }

        //Se hace una petición a la URL construida utilizando la función fetch(), que es una manera moderna y simplificada de realizar peticiones HTTP
        fetch(url)
            //El resultado de la petición es procesado en formato JSON utilizando .json()
            .then((res) => res.json())
            //Una vez obtenido el JSON de la petición, se llama a la función createPokemon() pasándole dicho objeto JSON y el parámetro modal, para que cree un elemento HTML con los datos del pokemon obtenidos y lo muestre en pantalla (o en una ventana modal según corresponda)
            .then((data) => {
                createPokemon(data);
                pokemonForm.reset();

                //Cuando se haya terminado de crear el pokemon en pantalla, se ocultará un spinner que estaba animando mientras se cargaban los datos
                spinner.style.display = 'none';
            })
            //Si hubo algún error en la petición, se informa en consola con .catch()
            .catch((err) => console.log(err));
    };

    //evento del formulario
    //evento del formulario
    pokemonForm.addEventListener('submit', (event) => {
        event.preventDefault(); // evitar recarga por defecto de la página

        // Eliminar las cartas existentes en pantalla
        const existingCards = document.querySelectorAll('.flip-card');
        // El código presentado elimina todas las cartas existentes en pantalla y sirve para asegurarse de que solo aparezca la información del pokemon más reciente buscado por el usuario.
        // Primero, se utiliza document.querySelectorAll para seleccionar todos los elementos con la clase .flip-card, que son las cartas que se crean cuando se busca un nuevo Pokemon con el formulario. Luego se utiliza Array.from para convertir esa selección NodeList (un tipo especial de colección de elementos HTML), que no tiene acceso al método forEach.
        // A continuación, se utiliza forEach para iterar sobre cada carta encontrada y se usa el método remove() para eliminarla del documento HTML.
        // De esta manera, después de eliminar las cartas antiguas, la función createPokemon puede crear una nueva carta para el nuevo Pokemon que el usuario busca utilizando el formulario.

        Array.from(existingCards).map((card) => card.remove());
        const pokemonName = pokemonInput.value.toLowerCase().trim();
        if (pokemonName === '') return; // no hacer nada si se envía un nombre vacío
        getPokemon(pokemonName);
    });

    //recorrer los pokemones se encarga de llamar iteradas veces la funcion get pokemon
    //paginancion antes estaba number como parametro

    let firstIndex = 1;
    let lastIndex = 7;
    let arrayPokemon = [];

    const previous = document.getElementById('previous');

    previous.addEventListener('click', () => {
        if (firstIndex === 1) {
            previous.classList.add('btn_opacity');
        } else {
            firstIndex -= 6;
            getPokemons(firstIndex, lastIndex);
            removerElementosRepetidos(pokemonContainer);
        }
    });

    const next = document.getElementById('next');

    next.addEventListener('click', () => {
        if (firstIndex < arrayPokemon) {
            next.classList.add('btn_opacity');
        } else {
            firstIndex += 6;
            previous.classList.remove('btn_opacity');
            getPokemons(firstIndex, lastIndex);
            removerElementosRepetidos(pokemonContainer);
        }
    });

    const getPokemons = (offset, limit) => {
        spinner.style.display = 'block';
        for (let i = offset; i <= offset + limit; i++) {
            arrayPokemon.push(i);
            getPokemon(i);
        }
    };
    // funcion para remover los pokemones al pasar la pagina
    function removerElementosRepetidos(parent) {
        // mientras en el pokemonContainer que es el contenedor donde se renderiza los pokemones hay una tarjeta se quita y se agrega las nuevas
        while (parent.firstChild) {
            parent.removeChild(parent.firstChild);
        }
    }
    getPokemons(firstIndex, lastIndex);

    //crear las cartas de los pokemones
    const createPokemon = (pokemon) => {
        const pokemonContainer = document.querySelector('.pokemon_container');
        const modalSearch = document.querySelector('.pokemon_container');
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
    };

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
});
document.addEventListener('DOMContentLoaded', () => {
    const pokemonContainer = document.querySelector('.pokemon_container');
    const pokemonInput = document.querySelector('.pokemon_name');
    const pokemonForm = document.querySelector('.pokemon_form');
    const suggestionsContainer = document.querySelector(
        '.suggestions_container',
    );
    const spinner = document.querySelector('#spinner');

    const getPokemon = (pokemonName) => {
        let url = `https://pokeapi.co/api/v2/pokemon/${pokemonName}/`;

       

        fetch(url)
            .then((res) => res.json())

            .then((data) => {
                createPokemon(data);

                pokemonForm.reset();

                spinner.style.display = 'none';
            })

            .catch((err) => console.log(err));
    };

    pokemonForm.addEventListener('submit', (event) => {
        event.preventDefault();

        const existingCards = document.querySelectorAll('.flip-card');

        Array.from(existingCards).map((card) => card.remove());
        const pokemonName = pokemonInput.value.toLowerCase().trim();
        if (pokemonName === '') return; // no hacer nada si se envía un nombre vacío
        getPokemon(pokemonName);
    });

    //buscar pokemon por sugerencia
    pokemonInput.addEventListener('input', async () => {
        const searchTerm = pokemonInput.value.trim().toLowerCase();
        if (searchTerm.length >= 2) {
            try {
                const response = await fetch(
                    `https://pokeapi.co/api/v2/pokemon?limit=1118`,
                );
                const data = await response.json();
                const matchingPokemon = data.results.filter((pokemon) =>
                    pokemon.name.startsWith(searchTerm),
                );
                const suggestionsHTML = matchingPokemon
                    .map(
                        (pokemon) =>
                            `<div class="suggestion">${pokemon.name}</div>`,
                    )
                    .join('');
                suggestionsContainer.innerHTML = suggestionsHTML;
            } catch (err) {
                console.error(err);
            }
        } else {
            suggestionsContainer.innerHTML = '';
        }
    });

    suggestionsContainer.addEventListener('click', (event) => {
        const clickedSuggestion = event.target;
        if (!clickedSuggestion.classList.contains('suggestion')) return;
        const selectedPokemon = clickedSuggestion.innerText;
        getPokemon(selectedPokemon);
        suggestionsContainer.innerHTML = '';
    });
    
    let firstIndex = 1;
    let lastIndex = 7;
    let arrayPokemon = [];

    const addOpacity = () => {
        const previous = document.getElementById('previous');
        previous.classList.add('btn_opacity');
    };

    //resto del código...
const getPokemon = (pokemonName) => {
  let url = `https://pokeapi.co/api/v2/pokemon/${pokemonName}/`;

  fetch(url)
    .then((res) => res.json())
    .then((data) => {
      createPokemon(data);
      pokemonForm.reset();
      spinner.style.display = "none";
      // después de crear el nuevo Pokémon, muestra la tarjeta
      renderPokemonCard(data);
    })
    .catch((err) => console.log(err));
};

suggestionsContainer.addEventListener("click", (event) => {
  const clickedSuggestion = event.target;
  if (!clickedSuggestion.classList.contains("suggestion")) return;
  const selectedPokemon = clickedSuggestion.innerText;
  getPokemon(selectedPokemon);
  suggestionsContainer.innerHTML = "";
});

// función para renderizar la tarjeta del Pokémon
const renderPokemonCard = (pokemon) => {
  const card = document.createElement("div");
  card.classList.add("flip-card");

  const innerCard = document.createElement("div");
  innerCard.classList.add("flip-card-inner");

  const frontCard = document.createElement("div");
  frontCard.classList.add("card-front");

  // Agregar la imagen del Pokémon
  const pokemonImage = document.createElement("img");
  pokemonImage.setAttribute(
    "src",
    `${pokemon.sprites.other["official-artwork"].front_default}`
  );
  pokemonImage.setAttribute("alt", pokemon.name);
  frontCard.append(pokemonImage);

  // Agregar información sobre el Pokémon
  const name = document.createElement("h3");
  name.textContent = pokemon.name;
  const id = document.createElement("p");
  id.textContent = `ID: ${pokemon.id}`;
  const types = document.createElement("p");
  types.textContent = `Types: ${pokemon.types
    .map((type) => type.type.name)
    .join(", ")}`;

  const backCard = document.createElement("div");
  backCard.classList.add("card-back");
  backCard.append(name, id, types);

  innerCard.append(frontCard, backCard);
  card.append(innerCard);

  cardContainer.append(card);
};
document.addEventListener('DOMContentLoaded', () => {
    // ... existing code ...

    let btnButtonCount = 0;

    const getPokemon = (pokemonName) => {
        // ... existing code ...
        btnButtonCount++;
        if (btnButtonCount <= 2) {
            btnButton();
        }
    };

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

    // ... existing code ...
});
