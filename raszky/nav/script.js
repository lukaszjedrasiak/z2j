let hamburger = document.querySelector('#hamburger');

hamburger.addEventListener('click', () => {
    document.querySelector('#menu').classList.toggle('active');
})