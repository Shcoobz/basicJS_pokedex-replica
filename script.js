// const response = await fetch('https://pokeapi.co/api/v2/pokemon/1');
// const data = await response.json();

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

const leftButton = document.querySelector('.left-button');
const rightButton = document.querySelector('.right-button');

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

const resetMainScreen = () => {
  mainScreen.classList.remove('hide');
  for (const type of TYPES) {
    mainScreen.classList.remove(type);
  }
};

const capitalize = (str) => str[0].toUpperCase() + str.substr(1);

const fetchPokeData = (id) => {
  fetch(`https://pokeapi.co/api/v2/pokemon/${id}`)
    .then((res) => res.json())
    .then((data) => {
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
    });

  leftButton.addEventListener('click', handleLeftButtonClick);
  rightButton.addEventListener('click', handleRightButtonClick);

  for (const pokeListItem of pokeListItems) {
    pokeListItem.addEventListener('click', handleListItemClick);
  }
};

const fetchPokeList = (url) => {
  fetch(url)
    .then((res) => res.json())
    .then((data) => {
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
    });
};

const handleLeftButtonClick = () => {
  if (prevUrl) {
    fetchPokeList(prevUrl);
  }
};

const handleRightButtonClick = () => {
  if (nextUrl) {
    fetchPokeList(nextUrl);
  }
};

const handleListItemClick = (onClick) => {
  if (!onClick.target) return;

  const listItem = onClick.target;
  if (!listItem.textContent) return;

  const id = listItem.textContent.split('.')[0];

  fetchPokeData(id);
};

leftButton.addEventListener('click', handleLeftButtonClick);
rightButton.addEventListener('click', handleRightButtonClick);

for (const pokeListItem of pokeListItems) {
  pokeListItem.addEventListener('click', handleListItemClick);
}

fetchPokeList('https://pokeapi.co/api/v2/pokemon?offset=0&limit=20');
