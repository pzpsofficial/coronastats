// Accordion

const accordion = document.querySelector('.accordion');

accordion.addEventListener('click', (e) => {
  if (e.target.classList.contains('content')) return;

  const panel = e.target.closest('.panel');

  const content = panel.nextElementSibling;

  content.classList.toggle('active');
});

if (!navigator.geolocation) {
  alert('Your browser does not support geolocation');
} else {

  navigator.geolocation.getCurrentPosition((data) => {console.log(data)}, () => alert('Error'));
  


}