const firstOperand = Number.parseFloat(prompt('Podaj pierwszą liczbę.').replace(',', '.'));
const operator = prompt('Podaj znak działania (+ - * / %');
const secondOperand = Number.parseFloat(prompt('Podaj drugą liczbę.').replace(',', '.'));
let result = null;

if ((!(isNaN(firstOperand))) && ((operator === '+') || (operator === '-') || (operator === '*') || (operator === '/') || (operator === '%')) && (!isNaN(secondOperand))) {
    switch (operator) {
        case '+':
            result = firstOperand + secondOperand;
            break;
        case '-':
            result = firstOperand - secondOperand;
            break;
        case '*':
            result = firstOperand * secondOperand;
            break;
        case '/':
            if (secondOperand === 0) {
                result = 'Nie można dzielić przez 0'
            } else {
                result = firstOperand / secondOperand;
            }
            break;
        case '%':
            result = firstOperand % secondOperand;
            break;
    }
    alert(`Wynik: ${result}`);
} else {
    alert('Niewłaściwy format danych wejściowych');
}