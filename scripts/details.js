import 'regenerator-runtime';
import Chart from 'chart.js';

const country = sessionStorage.getItem('country');
const mapid = document.querySelector('#mapid');

// Section top

const sectionTop = document.querySelector('.section-top');

const getData = async (country) => {
  const res1 = await fetch(
    `https://api.covid19api.com/dayone/country/${country}/status/confirmed`
  );
  const res2 = await fetch(
    `https://api.covid19api.com/dayone/country/${country}/status/recovered`
  );
  const res3 = await fetch(
    `https://api.covid19api.com/dayone/country/${country}/status/deaths`
  );
  const data1 = await res1.json();
  const data2 = await res2.json();
  const data3 = await res3.json();
  return [data1, data2, data3];
};

const getCoords = async (country) => {
  const res = await fetch(
    `https://api.covid19api.com/dayone/country/${country}/status/confirmed`
  );
  const data = await res.json();
  console.log([+data[0].Lat, +data[0].Lon]);
  return [+data[0].Lat, +data[0].Lon];
};

const generateMap = async (cords) => {
  cords = await cords;

  let map = L.map('mapid').setView([cords[0], cords[1]], 5);

  L.tileLayer(
    'https://tiles.stadiamaps.com/tiles/alidade_smooth_dark/{z}/{x}/{y}{r}.png',
    {
      maxZoom: 20,
      attribution:
        '&copy; <a href="https://stadiamaps.com/">Stadia Maps</a>, &copy; <a href="https://openmaptiles.org/">OpenMapTiles</a> &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors',
    }
  ).addTo(map);

  mapid.append(map);
};

generateMap(getCoords(country));

const makeChart = async (data, type) => {
  data = await data;

  const transformedDataConfirmed = data[0].map((element) => {
    return element['Cases'];
  });
  const transformedLabels = data[0].map((element) => {
    return element['Date'].slice(0, 10);
  });

  const transformedDataRecovered = data[1].map((element) => {
    return element['Cases'];
  });

  const transformedDataDeaths = data[2].map((element) => {
    return element['Cases'];
  });

  let ctx = document.getElementById('myChart').getContext('2d');
  let myChart = new Chart(ctx, {
    type: 'line',
    data: {
      labels: [...transformedLabels],
      datasets: [
        {
          label: 'Total confirmed cases',
          data: [...transformedDataConfirmed],
          backgroundColor: ['rgba(62, 62, 62, .5)'],
          borderColor: ['rgba(62, 62, 62, 1)'],
          fill: false,
          borderWidth: 5,
          yAxisID: 'y-axis-1',
        },
        {
          label: 'Total recovered cases',
          data: [...transformedDataRecovered],
          backgroundColor: ['rgba(22, 199, 154, .5)'],
          borderColor: ['rgba(22, 199, 154, 1)'],
          fill: false,
          borderWidth: 5,
          yAxisID: 'y-axis-1',
        },
        {
          label: 'Total death cases',
          data: [...transformedDataDeaths],
          backgroundColor: ['rgba(240, 84, 84, .5)'],
          borderColor: ['rgba(240, 84, 84, 1)'],
          fill: false,
          borderWidth: 5,
          yAxisID: 'y-axis-1',
        },
      ],
    },
    options: {
      scales: {
        yAxes: [
          {
            type: 'linear',
            display: 'true',
            id: 'y-axis-1',
            ticks: {
              beginAtZero: true,
            },
          },
        ],
      },
    },
  });
};

makeChart(getData(country));
