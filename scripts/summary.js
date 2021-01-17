import 'regenerator-runtime';

// fetch('https://api.covid19api.com/summary')
//   .then((res) => res)
//   .then((data) => console.log(data.json()));

const getSummary = async () => {
  const res = await fetch('https://api.covid19api.com/summary');
  const data = await res.json();
  console.log(data);
};

// getSummary();
