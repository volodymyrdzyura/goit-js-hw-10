import './css/styles.css';
import Notiflix from 'notiflix';
import debounce from 'lodash.debounce';

import { fetchCountries } from './fetchCountries';

const refs = {
  form: document.querySelector('#search-box'),
  countryList: document.querySelector('.country-list'),
  countryData: document.querySelector('.country-info'),
};

const DEBOUNCE_DELAY = 300;

refs.form.addEventListener('input', debounce(onInputValue, DEBOUNCE_DELAY));

function onInputValue() {
  const name = refs.form.value.trim();
  if (name === '') {
    return (refs.countryList.innerHTML = ''), (refs.countryData.innerHTML = '');
  }

  fetchCountries(name)
    .then(response => {
      console.log(response);
      refs.countryList.innerHTML = '';
      refs.countryData.innerHTML = '';
      if (response.length > 10) {
        Notiflix.Notify.info(
          'Too many matches found. Please enter a more specific name.'
        );
      } else if (response.length < 10 && response.length >= 2) {
        refs.countryList.insertAdjacentHTML(
          'beforeend',
          renderCountryList(response)
        );
      } else {
        refs.countryData.insertAdjacentHTML(
          'beforeend',
          renderCountryData(response)
        );
      }
    })

    .catch(() => {
      Notiflix.Notify.failure('Oops, there is no country with that name');
      return [];
    });
}

function renderCountryList(contries) {
  return contries
    .map(({ flags, name }) => {
      return `
          <li class="country-list__item">
              <img class="country-list__flag" src="${flags.svg}" alt="Flag of ${name.official}" width = 50px height = 50px>
              <h2 class="country-list__name">${name.official}</h2>
          </li>
          `;
    })
    .join('');
}

function renderCountryData(contries) {
  return contries
    .map(({ flags, name, capital, population, languages }) => {
      return `
      <img width="50px" height="50px" src='${flags.svg}' 
      alt='${name.official} flag' />
        <ul class="country-data__list">
            <li class="country-data__item"><p><b>name: </b>${
              name.official
            }</p></li>
            <li class="country-data__item"><p><b>capital: </b>${capital}</p></li>
            <li class="country-data__item"><p><b>population: </b>${population}</p></li>
            <li class="country-data__item"><p><b>languages: </b>${Object.values(
              languages
            )}</p></li>
        </ul>
        `;
    })
    .join('');
}
