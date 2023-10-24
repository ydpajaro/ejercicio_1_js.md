const searchForm = document.getElementById('search-form');
const nombreInput = document.getElementById('nombre-input');
const pokemonInfo = document.getElementById('pokemon-info');
const pokemonInfoError = document.getElementById('pokemon-info-error');
const evolutionButton = document.getElementById('evolution-button');
// const evolutionChainURL = '';

const customImageURL = 'assets/img/error.png';
const homeLink = document.getElementById('home-link');

function searchPokemon(nombre) {
    if (nombre.trim() === '') {
      
      const pokemonName = document.getElementById('pokemon-name');
      pokemonName.textContent = 'Por favor, ingresa un nombre de Pokémon válido.';
      
      const pokemonImage = document.getElementById('pokemon-image');
      pokemonImage.src = customImageURL;
      
      pokemonInfo.style.display = 'block';

    } else {
      
      axios.get(`https://pokeapi.co/api/v2/pokemon/${nombre.toLowerCase()}`)
        .then((response) => {
          const pokemonData = response.data;
          const pokemonNameFront = pokemonData.name;
          const officialArtworkImageURL = pokemonData.sprites.other["official-artwork"]["front_default"];
  
          const pokemonImage = document.getElementById('pokemon-image');
          pokemonImage.src = officialArtworkImageURL;
          
          const pokemonName = document.getElementById('pokemon-name');
          pokemonName.textContent = `${pokemonNameFront}`;

          const pokemonId = pokemonData.id;
          
          const abilities = pokemonData.abilities;

          const abilitiesList = abilities.map((ability) => ability.ability.name);
          const abilitiesText = abilitiesList.join(', ');

          const pokemonAbilities = document.getElementById('pokemon-abilities');
          pokemonAbilities.textContent = `Habilidades: ${abilitiesText}`;

          PokemonSpecies(pokemonId)

          pokemonInfo.style.display = 'block';
        })
        .catch((error) => {
          const pokemonName = document.getElementById('pokemon-name');
          pokemonName.textContent = `No se encontró ${nombre}. Por favor, verifica el nombre.`;
  
          const pokemonImage = document.getElementById('pokemon-image');
          pokemonImage.src = customImageURL;
  
          pokemonInfo.style.display = 'block';
          evolutionButton.style.display = 'none';
        });
    }
}

function PokemonSpecies(pokemonId) {
    axios.get(`https://pokeapi.co/api/v2/pokemon-species/${pokemonId}`)
      .then((response) => {
        const speciesData = response.data;
        const flavorTextEntries = speciesData.flavor_text_entries;
        let flavorText = null; 

        for (const entry of flavorTextEntries) {
          if (entry.language) {
            if (entry.language.name === "es") {
              
              flavorText = entry.flavor_text;
              break; 
            } else if (entry.language.name === "en" && !flavorText) {
              
              flavorText = entry.flavor_text;
            }
          }
        }

        
        const pokemonDescription = document.getElementById('pokemon-description');
        pokemonDescription.textContent = `Descripción: ${flavorText}`;

        // evolutionChainURL = null;

        const evolutionChainURL = speciesData.evolution_chain.url;
        console.log(evolutionChainURL)
             
        pokemonEvolution(evolutionChainURL,speciesData.name)
        pokemonInfo.style.display = 'block';
      })
      .catch((error) => {

        const pokemonSpeciesId = document.getElementById('pokemon-info-error');
        pokemonSpeciesId.textContent = `Error al obtener información de la especie del Pokémon:${error}.`;
  
        const pokemonImage = document.getElementById('pokemon-image');
        pokemonImage.src = customImageURL;
        
        pokemonInfo.style.display = 'block';
      });
  }

function pokemonEvolution(evolutionChainURL,nombre) {
  axios.get(evolutionChainURL)
    .then((response) => {
      const evolutionData = response.data;
      const evolutionElement = document.getElementById('pokemon-evolution');
      const evolutionButton = document.getElementById('evolution-button');
      evolutionButton.textContent = 'Evolucionar'; 
      console.log(evolutionData)
      const arregloVacio = [];
      function extractEvolutions(chain) {
        if (chain.species && chain.species.name) {
          arregloVacio.push(chain.species.name);
        }
        if (chain.evolves_to && chain.evolves_to.length > 0) {
            chain.evolves_to.forEach(subchain => {
                extractEvolutions(subchain);
            });
        }
    }

    

    extractEvolutions(evolutionData.chain)
    const pokemonPosition = arregloVacio.indexOf(nombre);
    console.log(arregloVacio)
    console.log(nombre)
    console.log('Posición del pokemon: '+ arregloVacio.indexOf(nombre))
    console.log('Cantidad de evoluciones' + arregloVacio.length)

    if(arregloVacio.length   > pokemonPosition + 1){
      console.log('El pokemon está en la posicion: '+ pokemonPosition)
      console.log('Siguiente posicion de evolucion' + arregloVacio[(pokemonPosition + 1)])

      const pokemonNextEvolution = arregloVacio[pokemonPosition +1]

      console.log('Siguiente evolución:' + arregloVacio[pokemonPosition +1])

      evolutionButton.addEventListener('click',function(){
        searchPokemon(pokemonNextEvolution);
      });
      // searchPokemon(pokemonNextEvolution)

      evolutionElement.textContent = `Evolucionar a: ${pokemonNextEvolution}`;
      evolutionButton.style.display = 'block';
     
    
    }else {
      evolutionElement.textContent = "No puede evolucionar";
      evolutionButton.style.display = 'none';
    }  
      

      
    })
    // .catch((error) => {
    //   console.error("Ocurrió un error al obtener datos de evolución:", error);
    //   const pokemonEvolutionError = document.getElementById('pokemon-info-error');
    //   pokemonEvolutionError.textContent = `Ocurrió un error al obtener datos de evolución: ${error}.`;

    //   const pokemonImage = document.getElementById('pokemon-image');
    //   pokemonImage.src = customImageURL;

    //   pokemonInfo.style.display = 'block';
    // });
}
searchForm.addEventListener('submit', function(event) {
  event.preventDefault(); 
  const nombre = nombreInput.value;
  searchPokemon(nombre);
  limpiarBusqueda();
});

function limpiarBusqueda() {
  const pokemonAbilities = document.getElementById('pokemon-abilities');
  const pokemonDescription = document.getElementById('pokemon-description');
  const pokemonEvolution = document.getElementById('pokemon-evolution');
  const evolutionButton = document.getElementById('evolution-button');

  pokemonAbilities.textContent = '';
  pokemonDescription.textContent = '';
  pokemonEvolution.textContent = '';

 
  evolutionButton.style.display = 'none';
  evolutionButton.textContent = '';
}

homeLink.addEventListener('click', function(event) {
    
    event.preventDefault();

    pokemonInfo.style.display = 'none';
    evolutionButton.style.display = 'none'
  
    nombreInput.value = '';
})

