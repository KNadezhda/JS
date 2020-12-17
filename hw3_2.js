const basket = [
    {
        id: 56,
        name: 'Книга',
        price: 250,
        quantity: 2
    },
    {
        id: 32,
        name: 'Карандаш',
        price: 25,
        quantity: 3
    },
    {
        id: 75,
        name: 'Маркер',
        price: 37,
        quantity: 2
    }
];

function countBasketPrice(basket) {
    let totalPrice = 0;
    for (let i = 0; i < basket.length; i++) {
        totalPrice += basket[i].price * basket[i].quantity
    }
    return totalPrice
}
console.log(countBasketPrice(basket));



