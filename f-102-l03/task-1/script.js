if (confirm('Chcesz zagrać w grę?')) {
    let guess = Math.floor(Math.random() * 10);
    console.log(guess);
    
    let answer = Number.parseInt(prompt('Podaj liczbę od 0 do 9'));
    if (!(isNaN(answer))) {
        if (answer > guess) {
            console.log(`answer: ${answer}`);
            alert(`Przeszacowałeś/-aś! Wylosowana liczba to ${guess}.`);
        } else if (answer < guess) {
            console.log(`answer: ${answer}`);
            alert(`Niedoszacowałeś/-aś! Wylosowana liczba to ${guess}.`)
        } else {
            console.log(`answer: ${answer}`);
            alert('Trafiłeś/-aś!');
        }
    } else {
        alert('Musisz wpisać liczbę!');
    }

} else {
    alert("Pa pa!");
}
