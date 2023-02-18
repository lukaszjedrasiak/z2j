const formLogin = document.forms.login;

function validateCredentials(credentials) {
    //console.log('validating...');
    for (const key in credentials) {
        const item = document.querySelector(`#${key}`);
        if (!credentials[key]) {
            item.classList.add('outline');
        } else {
            item.classList.remove('outline');
        }
    }

    return (Object.values(credentials).every(item => item !==""));
}

formLogin.addEventListener('submit', event => {
    event.preventDefault();
    //console.log('clicked...');

    const credentials = {
        gender: formLogin.elements.gender.value,
        name: formLogin.elements.name.value,
        surname: formLogin.elements.surname.value,
        birthDate: formLogin.elements.birthDate.value,
        login: formLogin.elements.login.value,
        password: formLogin.elements.password.value,
    }

    if (validateCredentials(credentials)) {
        const birthVerb = credentials.gender === 'Pan' ? 'urodzony' : 'urodzona';
        //console.log(`${credentials.gender} ${credentials.name} ${credentials.surname}, ${birthVerb} ${credentials.birthDate}, chce utworzyć konto o loginie "${credentials.login}".`);
        alert(`${credentials.gender} ${credentials.name} ${credentials.surname}, ${birthVerb} ${credentials.birthDate}, chce utworzyć konto o loginie "${credentials.login}".`);
    }

})