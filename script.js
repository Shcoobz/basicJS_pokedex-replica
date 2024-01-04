const INITIAL_POKE_API_URL = 'https://pokeapi.co/api/v2/pokemon?offset=0&limit=20';

const BASE_POKE_API_URL = 'https://pokeapi.co/api/v2/pokemon/';

const mainScreen = document.querySelector('.main-screen');
const pokeName = document.querySelector('.poke-name');
const pokeId = document.querySelector('.poke-id');
const pokeFrontImg = document.querySelector('.poke-front-image');
const pokeBackImg = document.querySelector('.poke-back-image');
const pokeTypeOne = document.querySelector('.poke-type-one');
const pokeTypeTwo = document.querySelector('.poke-type-two');
const pokeWeight = document.querySelector('.poke-weight');
const pokeHeight = document.querySelector('.poke-height');
const pokeListItems = document.querySelectorAll('.list-item');
const prevButton = document.querySelector('.left-button');
const nextButton = document.querySelector('.right-button');

const TYPES = [
  'normal',
  'fighting',
  'flying',
  'poison',
  'ground',
  'rock',
  'bug',
  'ghost',
  'steel',
  'fire',
  'water',
  'grass',
  'electric',
  'psychic',
  'ice',
  'dragon',
  'dark',
  'fairy',
];

let prevUrl = null;
let nextUrl = null;

function capitalize(str) {
  return str[0].toUpperCase() + str.substr(1);
}

function resetMainScreen() {
  mainScreen.classList.remove('hide');

  TYPES.forEach((type) => {
    mainScreen.classList.remove(type);
  });
}

/**
 * Fetches Pokémon data and displays it on the main screen.
 *
 * @param {number} id - The ID of the Pokémon to fetch and display.
 * @returns {void}
 */
async function fetchPokeData(id) {
  try {
    const POKE_DATA_API_URL = `${BASE_POKE_API_URL}${id}`;
    const response = await fetch(POKE_DATA_API_URL);
    const data = await response.json();

    resetMainScreen();

    const dataTypes = data['types'];
    const dataFirstType = dataTypes[0];
    const dataSecondType = dataTypes[1];

    pokeTypeOne.textContent = capitalize(dataFirstType['type']['name']);

    if (dataSecondType) {
      pokeTypeTwo.classList.remove('hide');
      pokeTypeTwo.textContent = capitalize(dataSecondType['type']['name']);
    } else {
      pokeTypeTwo.classList.add('hide');
      pokeTypeTwo.textContent = '';
    }

    mainScreen.classList.add(dataFirstType['type']['name']);

    pokeName.textContent = capitalize(data['name']);
    pokeId.textContent = '#' + data['id'].toString().padStart(3, '0');
    pokeWeight.textContent = data['weight'];
    pokeHeight.textContent = data['height'];

    pokeFrontImg.src = data['sprites']['front_default'] || '';
    pokeBackImg.src = data['sprites']['back_default'] || '';
  } catch (error) {
    console.error('Error fetching Poke Data:', error);
  }
}

/**
 * Fetches a list of Pokémon and populates the list of Pokémon names.
 *
 * @param {string} url - The URL of the Pokémon list to fetch.
 * @returns {void}
 */
async function fetchPokeList(url) {
  try {
    const response = await fetch(url);
    const data = await response.json();

    const results = data['results'];
    const previous = data['previous'];
    const next = data['next'];

    prevUrl = previous;
    nextUrl = next;

    for (let i = 0; i < pokeListItems.length; i++) {
      const pokeListItem = pokeListItems[i];
      const resultData = results[i];

      if (resultData) {
        const name = resultData['name'];
        const url = resultData['url'];
        const urlArr = url.split('/');
        const id = urlArr[urlArr.length - 2];

        pokeListItem.textContent = id + '.' + capitalize(name);
      } else {
        pokeListItem.textContent = '';
      }
    }
  } catch (error) {
    console.error('Error fetching Poke List:', error);
  }
}

/**
 * Handles click on the "Previous" button by fetching the previous page of Pokémon.
 *
 * @returns {void}
 */
function handlePrevButtonClick() {
  if (prevUrl) {
    fetchPokeList(prevUrl);
  }
}

/**
 * Handles click on the "Next" button by fetching the next page of Pokémon.
 *
 * @returns {void}
 */
function handleNextButtonClick() {
  if (nextUrl) {
    fetchPokeList(nextUrl);
  }
}
if (nextUrl) {
  fetchPokeList(nextUrl);
}

/**
 * Handles click on a Pokémon list item to display its details.
 *
 * @param {MouseEvent} event - The click event object.
 * @returns {void}
 */
const handleListItemClick = (onClick) => {
  if (!onClick.target) return;
  const listItem = onClick.target;
  if (!listItem.textContent) return;
  const id = listItem.textContent.split('.')[0];
  fetchPokeData(id);
};

/**
 * Placeholder function for handling Pokémon data side buttons.
 *
 * @returns {void}
 */
function pokeDataSideButtons() {}

/**
 * Attaches event listeners to navigation buttons for the Pokémon list.
 *
 * @returns {void}
 */
function pokeListSideButtons() {
  prevButton.addEventListener('click', handlePrevButtonClick);
  nextButton.addEventListener('click', handleNextButtonClick);

  addClickEventListenersToPokeListItems();
}

/**
 * Attaches click event listeners to Pokémon list items.
 *
 * @returns {void}
 */
function addClickEventListenersToPokeListItems() {
  pokeListItems.forEach((pokeListItem) => {
    pokeListItem.addEventListener('click', handleListItemClick);
  });
}

/**
 * Initializes event listeners to handle interactions.
 *
 * @returns {void}
 */
function eventListeners() {
  pokeDataSideButtons();
  pokeListSideButtons();
}

/**
 * The main function to start fetching and displaying Pokémon data.
 *
 * @returns {void}
 */
function main() {
  fetchPokeList(INITIAL_POKE_API_URL);
  eventListeners();
}

// Execute the main function to start the application.
main();
