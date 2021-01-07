const directory = {
    directoryBlock: null,
    basket: {}, // ссылка на корзину
    catalog: [
        {
            id_goods: 56,
            goods_name: 'Книга',
            // image: '#'
            price: 250,
            quantity: 1,
        },
        {
            id_goods: 32,
            goods_name: 'Карандаш',
            // image: '#'
            price: 25,
            quantity: 1,
        },
        {
            id_goods: 75,
            goods_name: 'Маркер',
            // image: '#'
            price: 37,
            quantity: 1,
        },
    ],
    init(directoryBlockClass, basket) {
        this.directoryBlock = document.querySelector(`.${directoryBlockClass}`);
        this.basket = basket;
        this.render();
        this.addEventHandlers(); // обработка событий
    },

    /** представление каталога */

    render() {
        if (this.getDirectoryListLength() > 0) {
            this.renderDirectoryList();
        } else {
            this.renderEmptyDirectory();
        }
    },

    /**
     * Добавляем обработку событий клика
     * добавление в корзину товара
     */

    addEventHandlers() {
        this.directoryBlock.addEventListener('click', event => this.addToBasket(event));
    },


    /** обращаемся к корзине и добавляем товар id */

    addToBasket(event) {
        if (!event.target.classList.contains('goods__add-to-basket')) return;
        const id_goods = +event.target.dataset.id_goods;
        this.basket.addToBasket(id_goods);
    },

    /** получаем список товаров из каталога */

    getDirectoryListLength() {
        return this.catalog.length;
    },

    /** представление списка товаров */

    renderDirectoryList() {
        this.directoryBlock.innerHTML = '';
        this.catalog.forEach(item => {
            this.directoryBlock.insertAdjacentHTML('beforeend', this.renderDirectoryItem(item));
        });
    },

    /**
     * Рендер отдельного товара из списка
     * @param item - товар
     * @returns {string} - сгенерированая строка разметки
     */

    renderDirectoryItem(item) {
        return `<div class="goods">
                <h3>${item.goods_name}</h3>
                <p>${item.price} руб.</p>
                <button class="goods__add-to-basket" data-id_goods="${item.id_goods}">Добавить в корзину</button>
            </div>`;
    },

    /** представление пустого каталога */

    renderEmptyDirectory() {
        this.directoryBlock.innerHTML = '';
        this.directoryBlock.insertAdjacentHTML('beforeend', `Каталог пустой.`);
    },
};

const basket = {
    basketBlock: null,
    basketButton: null,
    basketIdCount: null,
    directoryCatalog: [], //из каталога берём id
    products: [
        {
            id_goods: 56,
            goods_name: 'Книга',
            price: 250,
            quantity: 1

        },
    ],

    /**
     * Метод инициальзации корзины
     * @param basketBlock - класс блока корзины
     * @param basketButton - класс кнопки очистки корзины
     * @param directoryCatalog - список товаров в каталоге
     */

    init(basketBlock, basketButton, directoryCatalog) {
        this.basketBlock = document.querySelector(`.${basketBlock}`);
        this.basketButton = document.querySelector(`.${basketButton}`);
        this.directoryCatalog = directoryCatalog;

        this.addEventHandlers();
        this.render();
    },

    /** обработка событий */

    addEventHandlers() {
        this.basketButton.addEventListener('click', this.dropBasket.bind(this));
    },

    /** очистка корзины */

    dropBasket() {
        this.products = [];
        this.render();
    },

    /** представление корзины */

    render() {
        if (this.getBasketGoodsLength() > 0) {
            this.renderBasketList();
        } else {
            this.renderEmptyBasket();
        }
    },

    findGoods(id_goods) {
        return this.directoryCatalog.find(goods => goods.id_goods === id_goods);
    },

    /** добавление товара */

    addToBasket(id_goods) {
        const goods = this.findGoods(id_goods);

        if (goods) {
            this.products.push({...goods});
            this.render();
        } else {
            alert('Ошибка добавления!');
        }

    },

    /**
     * Получение количества товаров в корзине
     * @returns {number}
     */
    getBasketGoodsLength() {
        return this.products.length;
    },

    /**
     * Рендер пустой корзины
     */
    renderEmptyBasket() {
        this.basketBlock.innerHTML = '';
        this.basketBlock.insertAdjacentHTML('beforeend', 'Корзина пуста.');
    },

    /**
     * Рендер списка товаров в корзине
     */
    renderBasketList() {
        this.basketBlock.innerHTML = '';
        this.products.forEach(item => {
            this.basketBlock.insertAdjacentHTML('beforeend', this.renderBasketItem(item));
        });
    },

    /**
     * Рендер отдельного товара в корзине
     * @param item - товар
     * @returns {string} - сгененрированая строка разметки
     */
    renderBasketItem(item) {
        return `<div>
                <h3>${item.goods_name}</h3>
                <p>${item.price} руб.</p>
                <p>${item.quantity} шт.</p>
                <p>${item.quantity * item.price} руб.</p>
            </div>`;
    },

};

directory.init('catalog', basket);
basket.init('basket-list', 'basket-btn', directory.catalog);

/** для подсчета Итого countBasketPrice в корзине можно воспользоваться методом reduce и вывести с помощью insertAdjacentHTML и afterend */
/** в корзине увеличивать и уменьшать количество одинакового товара можно на основании сравнения id_goods */