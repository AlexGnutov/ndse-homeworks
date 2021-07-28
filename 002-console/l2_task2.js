#!/Program Files/nodejs node

const readline = require('readline');
const input = readline.createInterface(process.stdin);

const value = randomazer();
console.log('Загадано число от 0 до 100');

input.on('line', (data) => checkNumber(data));

function randomazer() {
    return Math.round(Math.random() * 100);
}

function checkNumber(line) {
    const number = Number(line);
    if (isNaN(number)) {
        console.log('Некорректный ввод!');
    }
    if (number > value) {
        console.log('Ваше значение больше загаданного');
    } else if (number < value) {
        console.log('Ваше значение меньше загаданного');
    } else if (number === value) {
        console.log('Вы угадали! ' + number + '!');
        process.exit(0);
    }
}
