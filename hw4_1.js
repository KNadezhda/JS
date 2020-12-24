//let a = parseInt(prompt('введите число от 0 до 999'))
//let a = 6;

function numberToObject(a) {
    if (a < 0 || a > 999) {
        console.log('Число превышает 999');
        return {};
    }
    const b = {};
    b.units = a % 10;

    b.dozens = Math.floor(a / 10) % 10;

    b.hundreds = Math.floor(a / 100);

    return b;
}

console.log(numberToObject(2550));
