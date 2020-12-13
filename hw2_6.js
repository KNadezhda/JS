function addition(x, y) {
    return (x + y);
}

function subtraction(x, y) {
    return (x - y);
}

function generation(x, y) {
    return (x * y);
}

function division(x, y) {
    return (x / y);
}

function mathOperation(arg1, arg2, operation) {
    switch (operation) {
        case '+':
            return 'сумма: ' + addition(arg1, arg2);
        case '-':
            return 'разность: ' + subtraction(arg1, arg2);
        case '*':
            return 'произведение: ' + generation(arg1, arg2);
        case '/':
            return 'частное: ' + division(arg1, arg2);
    }
}

let mathOpr = mathOperation(3, 4, '+');
let mathOpr1 = mathOperation(3, 4, '-');
let mathOpr2 = mathOperation(3, 4, '*');
let mathOpr3 = mathOperation(3, 4, '/');
console.log(mathOpr);
console.log(mathOpr1);
console.log(mathOpr2);
console.log(mathOpr3);
