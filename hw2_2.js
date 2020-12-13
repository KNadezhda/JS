let a = 2;
let x = 1 + (a *= 2); // a *= 2 присваивает значение 4 затем прибавляем 1

console.log(a); // 4
console.log(x); // 5