function power(val, pow) {
    if (pow !== 1) {
        return val * power(val, pow - 1);
    }
    return val;
}

let divPower = power(5, 3);
console.log(divPower)
