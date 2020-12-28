const basketItem = {
    render(product) {
        return `<div class="product">
                    <div><b>Наименование</b>: ${product.name}</div>
                    <div><b>Цена</b>: ${product.price}</div>
                    <div><b>Количество</b>: ${product.quantity}</div>
                    <div><b>Итого</b>: ${product.quantity * product.price}</div>
                </div>`;
    }
};
const basket = {
    basketListBlock: null,
    basketButton: null,
    basketItem,
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

    init: function () {
        this.basketListBlock = document.querySelector('.basket-list');
        this.basketButton = document.querySelector('.basket-btn');
        this.basketButton.addEventListener('click', this.clearBasket.bind(this));

        this.render();
    },

    render() {
        if (this.products.length) {
            this.products.forEach(product => {
                this.basketListBlock.insertAdjacentHTML('beforeend', this.basketItem.render(product));
            });
            this.basketListBlock.insertAdjacentHTML('beforeend', `Итого в корзине: ${this.products.length} позиции стоимостью ${this.countBasketPrice()} рублей`);
        } else {
            this.basketListBlock.textContent = 'Ваша корзина пуста';
        }
    },
    countBasketPrice: function () {
        return this.products.reduce(function (totalPrice, basketItem) {
            return  totalPrice + basketItem.price * basketItem.quantity}, 0);
    },
    clearBasket() {
        this.products = [];
        this.render();
    },
};

basket.init();
