const basket = {
    products: [
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
        },
    ],

    countBasketPrice: function () {
        return this.products.reduce((totalPrice, cartItem) => totalPrice += cartItem.price * cartItem.quantity, 0);
    },
};

console.log(basket.countBasketPrice())