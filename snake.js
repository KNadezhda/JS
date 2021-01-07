/** 1)выводить счет в режиме реального времени счетчик съеденой еды, длина змейки - 1
 * 2) гет фуд каунт отрисовать над полем
 * 3) генерация припятствия - камушки, может зависить от количества съеденой еды */

"use strict";
const settings = {
    rowsCount: 21,
    colsCount: 21,
    speed: 2,
    winFoodCount: 50,
};
// делаем прямой доступ к настройкам
const config = {
    settings,

    init(userSettings) {
        Object.assign(this.settings, userSettings);
    },

    getRowsCount() {
        return this.settings.rowsCount;
    },

    getColsCount() {
        return this.settings.colsCount;
    },

    getSpeed() {
        return this.settings.speed;
    },

    getWinFoodCount() {
        return this.settings.winFoodCount;
    },

    validate() {
        const result = {
            isValid: true,
            errors: [],
        };

        if (this.getRowsCount() < 10 || this.getRowsCount() > 30) {
            result.isValid = false;
            result.errors.push('Неверные настройки, значение rowsCount должно быть в диапазоне [10, 30].');
        }

        if (this.getColsCount() < 10 || this.getColsCount() > 30) {
            result.isValid = false;
            result.errors.push('Неверные настройки, значение colsCount должно быть в диапазоне [10, 30].');
        }

        if (this.getSpeed() < 1 || this.getSpeed() > 10) {
            result.isValid = false;
            result.errors.push('Неверные настройки, значение speed должно быть в диапазоне [1, 10].');
        }

        if (this.getWinFoodCount() < 5 || this.getWinFoodCount() > 50) {
            result.isValid = false;
            result.errors.push('Неверные настройки, значение winFoodCount должно быть в диапазоне [5, 50].');
        }

        return result;
    },
}
// строим карту поля
const map = {
    cells: {},
    usedCells: [],

    init(rowsCount, colsCount) {
        const table = document.getElementById('game'); // задаем id поля
        table.innerHTML = '';
        this.cells = {};
        this.usedCells = [];
// рисуем строки
        for (let row = 0; row < rowsCount; row++) {
            const tr = document.createElement('tr');
            tr.classList.add('row');
            table.appendChild(tr);
// рисуем столбцы
            for (let col = 0; col < colsCount; col++) {
                const td = document.createElement('td');
                td.classList.add('cell');
// задаем координаты ячейки
                this.cells[`x${col}_y${row}`] = td;
                tr.appendChild(td);
            }
        }
    },
// на каждой итерации очищаем все ячейки
    render(snakePointsArray, foodPoint, stonePoint) {
        for (const cell of this.usedCells) {
            cell.className = 'cell';
        }

        this.usedCells = []; // на каждой итерации очищаем все ячейки

        snakePointsArray.forEach((point, index) => {
            const snakeCell = this.cells[`x${point.x}_y${point.y}`]; // формируем ключ на основе данных точки делая ссылку на ячейку
            snakeCell.classList.add(index === 0 ? 'snakeHead' : 'snakeBody'); // если индекс ячейки = 0, то это голова змейки, в противном случае тело змеи
            this.usedCells.push(snakeCell);
        });

        const foodCell = this.cells[`x${foodPoint.x}_y${foodPoint.y}`];
        foodCell.classList.add('food');
        this.usedCells.push(foodCell);

        const stoneCell = this.cells[`x${stonePoint.x}_y${stonePoint.y}`];
        stoneCell.classList.add('stone');
        this.usedCells.push(stoneCell);
    },
};
// описание змейки
const snake = {
    body: [], // массив точек
    direction: null, // направление текущее
    lastStepDirection: null, //соотношение с предыдущим направлением
// метод инициализации змейки
    init(startBody, direction) {
        this.body = startBody;
        this.direction = direction;
        this.lastStepDirection = direction;
    },
// доступ к змейке
    getBody() {
        return this.body;
    },
// доступ к направлению движения
    getLastStepDirection() {
        return this.lastStepDirection;
    },
// some проверяет, является ли данная точка частью змейки
    isOnPoint(point) {
        return this.body.some(snakePoint => snakePoint.x === point.x && snakePoint.y === point.y);
    },
// перемещение змейки на один шаг
    makeStep() {
        this.lastStepDirection = this.direction; // двигаем змейку
        this.getBody().unshift(this.getNextStepHeadPoint()); // [p1, p2, p3] -> [p0, p1, p2]. unshift - добавит точку в массив с помощью метода getNextStepHeadPoint
        this.getBody().pop(); // pop - удаляем с конца элемент змейки
    },
// в массив будем помещать две точки хвоста
    growUp() {
        const lastBodyIndex = this.getBody().length - 1; // получаем индекс последней точки -1
        const lastBodyPoint = this.getBody()[lastBodyIndex]; // получаем от индекса точку координат
        const lastBodyPointClone = Object.assign({}, lastBodyPoint); // делаем копию точки координат

        this.getBody().push(lastBodyPointClone); // когда скушали еду добавляем в тело змейки копию точки в хвост [p1, p2, p3, p3] -> [p0, p1, p2, p3] на следующей итерации
    },
    goAside() {
        this.getBody().pop();
    },

    getNextStepHeadPoint() {
        const firstPoint = this.getBody()[0]; // получим первую точку головы
// в зависимости от направления куда будем двигаться, генерируем точки
        switch (this.direction) {
            case 'up':
                return {x: firstPoint.x, y: firstPoint.y - 1};
            case 'right':
                return {x: firstPoint.x + 1, y: firstPoint.y};
            case 'down':
                return {x: firstPoint.x, y: firstPoint.y + 1};
            case 'left':
                return {x: firstPoint.x - 1, y: firstPoint.y};
        }
    },
// устанавливаем направление
    setDirection(direction) {
        this.direction = direction;
    }
};
// объект еды
const food = {
    x: null,
    y: null,
// получаем координаты
    getCoordinates() {
        return {
            x: this.x,
            y: this.y,
        };
    },
// и возвращаем объект
    setCoordinates(point) {
        this.x = point.x;
        this.y = point.y;
    },
// проверка попадает ли точка на еду
    isOnPoint(point) {
        return this.x === point.x && this.y === point.y;
    },
};

const stone = {
    x: null,
    y: null,

    getStoneCoordinates() {
        return {
            x: this.x,
            y: this.y,
        }
    },

    setStoneCoordinates(point) {
        this.x = point.x;
        this.y = point.y;
    },

    isOnPoint(point) {
        return this.x === point.x && this.y === point.y;
    },
};
// проверка статуса игры
const status = {
    condition: null,

    setPlaying() {
        this.condition = 'playing';
    },

    setStopped() {
        this.condition = 'stopped';
    },

    setFinished() {
        this.condition = 'finished';
    },

    isPlaying() {
        return this.condition === 'playing';
    },

    isStopped() {
        return this.condition === 'stopped';
    },
};

const score = {
    count: null,
    countEl: null,

    /**
     * Инициализацирует счетчик.
     */
    init() {
        this.countEl = document.getElementById('score-count');
        this.drop();
    },

    /**
     * Инкрементирует счетчик.
     */
    increment() {
        this.count++;
        this.render();
    },

    /**
     * Сбрасывает счетчик.
     */
    drop() {
        this.count = 0;
        this.render();
    },

    /**
     * Отображает количество очков пользователю.
     */
    render() {
        this.countEl.textContent = this.count;
    }
};

const game = {
    config,
    map,
    snake,
    food,
    stone,
    status,
    score,
    tickInterval: null,
// инициализируем настройки, проверяем на ошибки
    init(userSettings) {
        this.config.init(userSettings);
        const validation = this.config.validate();

        if (!validation.isValid) {
            for (const err of validation.errors) {
                console.log(err);
            }
            return;
        }
// инициализируем карту, строки и колонки
        this.map.init(this.config.getRowsCount(), this.config.getColsCount());
// инициализируем счётчик
        this.score.init();
// обработчик событий и вызываем сброс состояния игры
        this.setEventHandlers();
        this.reset();
    },
// начальное состояние игры
    reset() {
        this.stop();
        this.score.drop();
        this.snake.init(this.getStartSnakeBody(), 'up'); // getStartSnakeBody - генерация змейки, up - передаем направление змейки
        this.food.setCoordinates(this.getRandomFreeCoordinates()); // getRandomFreeCoordinates - генерация еды
        this.stone.setStoneCoordinates(this.getRandomFreeCoordinates());
        this.render(); // отображаем
    },

    play() {
        this.status.setPlaying(); // режим играем
        this.tickInterval = setInterval(() => {
            this.tickHandler(); // будет отрабатывать функция tickHandler
        }, 1000 / this.config.getSpeed()); // устанавливаем скорость
        this.setPlayButton('Стоп'); // статус кнопки
    },

    stop() {
        this.status.setStopped(); // режим стоп игра
        clearInterval(this.tickInterval); // сброс до null
        this.setPlayButton('Старт'); // смена статуса кнопки
    },

    finish() {
        this.status.setFinished(); // режим окончания игры
        clearInterval(this.tickInterval); // сброс до null
        this.setPlayButton('Игра закончена', true);
    },

// метод будет проверять можно двигаться дальше или игра закончена
    tickHandler() {
        if (!this.canMakeStep()) return this.finish(); // если не отрабатывает canMakeStep то конец игры
// обращаемся к еде isOnPoint и проверяем следующий шаг getNextStepHeadPoint
        if (this.food.isOnPoint(this.snake.getNextStepHeadPoint())) {
            this.snake.growUp(); // если попадаем на еду то растем
            this.score.increment(); // увеличиваем счетчик
            this.food.setCoordinates(this.getRandomFreeCoordinates()); // вместо съеденой устанавливем новые координаты еды

            if (this.stone.isOnPoint(this.snake.getNextStepHeadPoint())) {
                this.snake.goAside();
                this.score.increment();
                this.stone.getStoneCoordinates(this.getRandomFreeCoordinates());
            }

            if (this.isGameWon()) {
                this.finish();
            } // проверяем выиграли или нет, если победа то финиш
        }

        this.snake.makeStep(); // если не выиграли то змейка перемещается
        this.render(); // возвращаемся к render
    },
// текст кнопки и состояние вкл или выкл
    setPlayButton(text, isDisabled = false) {
        const playButton = document.getElementById('playButton');

        playButton.textContent = text;
        isDisabled ? playButton.classList.add('disabled') : playButton.classList.remove('disabled'); // добавляем или удаляем метод
    },
// стартовая позиция змейки
    getStartSnakeBody() {
        return [
            {
                x: Math.floor(this.config.getColsCount() / 2), // поделили текущее кол-во колонок пополам
                y: Math.floor(this.config.getRowsCount() / 2), // поделили текущее кол-во строк пополам
            },
        ];
    },
// обработка клика по кнопке
    setEventHandlers() {
        document.getElementById('playButton').addEventListener('click', () => {
            this.playClickHandler(); // когда кликаем по кнопке
        });
        document.getElementById('newGameButton').addEventListener('click', () => {
            this.newGameClickHandler(); // когда кликаем по кнопке новая игра
        });
        document.addEventListener('keydown', (event) => {
            this.keyDownHandler(event); // когда кликаем по кнопке
        });
    },
// отрисовываем на карте змейку, еду и камень
    render() {
        this.map.render(this.snake.getBody(), this.food.getCoordinates(), this.stone.getStoneCoordinates());
    },
// генерация еды, чтобы не пересекалась с заданными уже ячейками
    getRandomFreeCoordinates() {
        const exclude = [this.food.getCoordinates(), this.stone.getStoneCoordinates(), ...this.snake.getBody()]; // создаем массив, кладем текущую точку еды и все точки связвнные с змейкой
// генерируем рандомно координаты, бесконечно.
        while (true) {
            const rndPoint = {
                x: Math.floor(Math.random() * this.config.getColsCount()),
                y: Math.floor(Math.random() * this.config.getRowsCount()),
            };
// проверяем входит или не входит точка в массив
            if (!exclude.some(exPoint => rndPoint.x === exPoint.x && rndPoint.y === exPoint.y)) {
                return rndPoint;
            }
        }
    },
// проверяем мы кликаем по playClickHandler и наш статус isPlaying, то останавливаем игру stop, если isStopped, то начинаем новую игру play
    playClickHandler() {
        if (this.status.isPlaying()) {
            this.stop();
        } else if (this.status.isStopped()) {
            this.play();
        }
    },
// запускаем игру заново
    newGameClickHandler() {
        this.reset();
    },
//
    keyDownHandler(event) {
        if (!this.status.isPlaying()) return; // если в статусе Игры

        const direction = this.getDirectionByCode(event.code); // получаем направление через getDirectionByCode
// проверка можем ли изменить направление
        if (this.canSetDirection(direction)) {
            this.snake.setDirection(direction);
        }
    },
// направление движения клавишами
    getDirectionByCode(code) {
        switch (code) {
            case 'KeyW':
            case 'ArrowUp':
                return 'up';
            case 'KeyD':
            case 'ArrowRight':
                return 'right';
            case 'KeyS':
            case 'ArrowDown':
                return 'down';
            case 'KeyA':
            case 'ArrowLeft':
                return 'left';
            default:
                return '';
        }
    },
//
    canSetDirection(direction) {
        const lastStepDirection = this.snake.getLastStepDirection(); // получаем предыдущее направление
// если идем на верх, то одновременно не можем идти вниз и т. д.
        return direction === 'up' && lastStepDirection !== 'down' ||
            direction === 'right' && lastStepDirection !== 'left' ||
            direction === 'down' && lastStepDirection !== 'up' ||
            direction === 'left' && lastStepDirection !== 'right';
    },
// проверка можеи ли делать шаг
    canMakeStep() {
        const nextHeadPoint = this.snake.getNextStepHeadPoint(); // получаем координату куда хотим пойти
// проверка координат головы змеи
        return !this.snake.isOnPoint(nextHeadPoint) &&
            nextHeadPoint.x < this.config.getColsCount() &&
            nextHeadPoint.y < this.config.getRowsCount() &&
            nextHeadPoint.x >= 0 &&
            nextHeadPoint.y >= 0;
    },
// выиграли если змейка достигла getWinFoodCount = 50 + 1
    isGameWon() {
        return this.snake.getBody().length > this.config.getWinFoodCount();
    },
};

// выводить счет в режиме реального времени счетчик съеденой еды, длина змейки - 1
// гет фуд каунт отрисовать под полем
// генерация припятствия - камушки, может зависить от количества съеденой еды


// передаем настройки игры
window.onload = game.init({speed: 5});