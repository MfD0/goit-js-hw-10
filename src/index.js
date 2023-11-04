import SlimSelect from 'slim-select';
import { fetchBreeds, fetchCatByBreed } from "./cat-api";
import 'slim-select/dist/slimselect.css';
import './css/styles.css';

const selector = document.querySelector('.breed-select');
const catInfo = document.querySelector('.cat-info');
const loader = document.querySelector('.loader');
const error = document.querySelector('.error');

loader.classList.add('hidden');
error.classList.add('is-hidden');
catInfo.classList.add('is-hidden');
selector.style.display = 'none';

fetchBreeds()
  .then(breeds => {
    selector.innerHTML = createSectionOptionsMarkup(breeds);
    selector.style.display = 'block';
    selector.classList.add('mySeleсtor')
    new SlimSelect({
      select: selector,
      placeholder: 'Select cat',
    });
  })
  .catch(fetchError)
  .finally(() => {
    loader.classList.add('is-hidden');
  });

function createSectionOptionsMarkup(breedsArr) {
  return breedsArr.map(({ id, name }) => `<option value="${id}">${name}</option>`).join('');
}

selector.addEventListener('change', selectBreed);

function displayCatInfo(catData) {
    const { url, breeds } = catData;
    catInfo.innerHTML = `
      <div class="cat-txt">
            <h1>${breeds[0].name}</h1>
            <p>${breeds[0].description}</p>
            <p><b>Temperament:</b> ${breeds[0].temperament}</p>
        </div>
        <div class="image">
            <img src="${url}" alt="${breeds[0].name}"/>
        </div>`;
    catInfo.classList.remove('is-hidden');
}

function selectBreed(evt) {
    loader.classList.remove('is-hidden');
    catInfo.classList.add('is-hidden');

    const breedId = evt.currentTarget.value;
    fetchCatByBreed(breedId)
        .then(data => {
            loader.classList.add('is-hidden');
            displayCatInfo(data[0]);
        })
        .catch(fetchError);
}

function fetchError(error) {
    loader.classList.add('is-hidden');
    Notify.failure('Oops! Something went wrong! Try reloading the page or select another cat breed!');
}
