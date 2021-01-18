import 'regenerator-runtime';
import { async } from 'regenerator-runtime';

const sectionCards = document.querySelector('.section-cards');
const input = document.querySelector('.search');
const select = document.querySelector('.select');
let startOrder = '';

window.addEventListener('load', () => {
  input.value = '';
  select.value = 'none';
});

// fetch('https://api.covid19api.com/summary')
//   .then((res) => res)
//   .then((data) => console.log(data.json()));

const getSummary = async () => {
  const res = await fetch('https://api.covid19api.com/summary');
  const data = await res.json();
  return data.Countries;
};

const getCountry = async (country) => {
  try {
    country = country.toLowerCase().replace(',', '').split(' ');
    // console.log(country);
    const res = await fetch(
      `https://restcountries.eu/rest/v2/alpha/${country}`
    );
    const data = await res.json();
    return data.flag;
  } catch (err) {
    console.log('Something went wrong');
  }
};

// getSummary();

const renderData = async (data) => {
  data.then(async (arr) => {
    const countriesFromApi = [];
    console.log(arr);

    arr.forEach((element) => {
      const img = countriesFromApi.push(getCountry(element.CountryCode));
    });

    const flags = await Promise.all([...countriesFromApi]);

    console.log(flags);

    arr.forEach((element, index) => {
      const card = `
        <div class="card" data-country="${element.Country}" data-new="${element.NewConfirmed}" data-total="${element.TotalConfirmed}" data-slug="${element.Slug}" data-code="${element.CountryCode}">
            <img src="${flags[index]}" alt="Flag" />
            <h3>${element.Country}</h3>
            <div class="info">
              <div class="new">
                <span class="bold">New cases</span>
                <div class="confirmed"><i class="fas fa-virus"></i> ${element.NewConfirmed}</div>
                <div class="deaths">
                  <i class="fas fa-skull-crossbones"></i> ${element.NewDeaths}
                </div>
                <div class="recovered">
                  <i class="fas fa-virus-slash"></i> ${element.NewRecovered}
                </div>
              </div>
              <div class="break"></div>
              <div class="total">
                <span class="bold">All cases</span>
                <div class="confirmed"><i class="fas fa-virus"></i> ${element.TotalConfirmed}</div>
                <div class="deaths">
                  <i class="fas fa-skull-crossbones"></i> ${element.TotalDeaths}
                </div>
                <div class="recovered">
                  <i class="fas fa-virus-slash"></i> ${element.TotalRecovered}
                </div>
              </div>
            </div>
            <a href="details.html" class="btn">Details</a>
          </div>
      `;
      sectionCards.insertAdjacentHTML('beforeend', card);
      startOrder = document.querySelectorAll('.card');
    });
  });
};

const renderSortedData = (data) => {
  sectionCards.innerHTML = '';
  data.forEach((card) => {
    sectionCards.insertAdjacentElement('beforeend', card);
  });
};

// getSummary();

renderData(getSummary());

let timer;

input.addEventListener('submit', (e) => {
  e.preventDefault();
});

input.addEventListener('input', (e) => {
  e.preventDefault();

  const cards = Array.from(document.querySelectorAll('.card'));

  cards.forEach((card) => {
    if (
      !card.children[1].textContent
        .toLowerCase()
        .includes(input.value.toLowerCase())
    ) {
      card.style.display = 'none';
    } else {
      card.style.display = 'block';
    }
  });
});

select.addEventListener('change', (e) => {
  e.preventDefault();

  const cards = Array.from(document.querySelectorAll('.card'));

  if (select.value === 'alfabetycznie_rosnaco') {
    cards.sort((a, b) => {
      if (a.style.display === 'none' && b.style.display === 'none') return;
      if (a.dataset.country.slice(0, 1) < b.dataset.country.slice(0, 1)) {
        return -1;
      } else {
        return 1;
      }
    });
    renderSortedData(cards);
  }

  if (select.value === 'alfabetycznie_malejaco') {
    cards.sort((a, b) => {
      if (a.dataset.country.slice(0, 1) > b.dataset.country.slice(0, 1)) {
        return -1;
      } else {
        return 1;
      }
    });
    renderSortedData(cards);
  }

  if (select.value === 'most_new') {
    console.log(cards);
    cards.sort((a, b) => {
      if (+a.dataset.new > +b.dataset.new) {
        return -1;
      } else if (+a.dataset.new < +b.dataset.new) {
        return 1;
      } else {
        return 0;
      }
    });
    renderSortedData(cards);
  }

  if (select.value === 'least_new') {
    console.log(cards);
    cards.sort((a, b) => {
      if (+a.dataset.new < +b.dataset.new) {
        return -1;
      } else if (+a.dataset.new > +b.dataset.new) {
        return 1;
      } else {
        return 0;
      }
    });
    renderSortedData(cards);
  }

  if (select.value === 'most_total') {
    console.log(cards);
    cards.sort((a, b) => {
      if (+a.dataset.total > +b.dataset.total) {
        return -1;
      } else if (+a.dataset.total < +b.dataset.total) {
        return 1;
      } else {
        return 0;
      }
    });
    renderSortedData(cards);
  }

  if (select.value === 'least_total') {
    console.log(cards);
    cards.sort((a, b) => {
      if (+a.dataset.total < +b.dataset.total) {
        return -1;
      } else if (+a.dataset.total > +b.dataset.total) {
        return 1;
      } else {
        return 0;
      }
    });
    renderSortedData(cards);
  }

  if (select.value === 'none') {
    renderSortedData(startOrder);
  }
});

sectionCards.addEventListener('click', (e) => {
  const el = e.target;
  if (!el.classList.contains('btn')) return;
  const country = el.closest('.card').dataset.slug;
  const code = el.closest('.card').dataset.code;
  sessionStorage.setItem('code', code);
  sessionStorage.setItem('country', country);
});
