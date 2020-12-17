function getPrimes(num) {
    const sieve = [];
    const primes = [];
    for (let i = 2; i <= num; i++) {
        if (!sieve[i]) {
            primes.push(i);
            for (let j = i * i; j <= num; j += i) {
                sieve[j] = true;
            }
        }
    }
    return primes;
}

gprs = getPrimes(100);
console.log(gprs)
//console.log(getPrimes(100));


function nextPrime(value) {
    if (value > 2) {
        let i, q;
        do {
            i = 3;
            value += 2;
            q = Math.floor(Math.sqrt(value));
            while (i <= q && value % i) {
                i += 2;
            }
        } while (i <= q);
        return value;
    }
    return value === 2 ? 3 : 2;
}

let value;
let result = [];
for (let i = 0; i < 25; i++) {
    value = nextPrime(value);
    result.push(value);
}
console.log(result);
