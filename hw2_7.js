console.log(null >= 0 || null <= 0); // true - нестрогое сравнение преобразует null в число, рассматривая его как 0
console.log(null == 0); // false - == значение null ни к чему не приводит
console.log(null > 0); // false - сравнение не приводит null к числу
