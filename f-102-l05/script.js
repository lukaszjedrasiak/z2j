let operator = '+';
let result = 0;

function getOperator(result) {
    do {
        operator = prompt(`Wynik częściowy: ${result}. Wpisz operator lub anuluj, aby zakończyć.`);
    } while((operator != '+') && (operator != '-') && (operator != '*') && (operator != '/') && (operator != '%') && (operator != '') && (operator != null));
    
    return operator; 
}

function addition(result, operand) {
    return result + operand;
}

function subtraction(result, operand) {
    return result - operand;
}

function multiplication(result, operand) {
    return result * operand;
}

function division(result, operand) {
    return result / operand;
}

function modulo(result, operand) {
    return result % operand;
}

function calculate(result, operator) {
    let operand;
    do {
        operand = Number.parseFloat(prompt('Podaj liczbę.').replace(',', '.'));
    } while (isNaN(operand) || ((operator === '/') && (operand === 0)));
    switch(operator) {
        case '+':
            return addition(result, operand);
        case '-':
            return subtraction(result, operand);
        case '*':
            return multiplication(result, operand); 
        case '/':
            return division(result, operand); 
        case '%':
            return modulo(result, operand); 
    }
}

do {
    result = calculate(result, operator)
    operator = getOperator(result);
} while ((operator != '') && (operator != null))

alert(`Wynik końcowy: ${result}`);