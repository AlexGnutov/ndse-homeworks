const yargs = require('yargs/yargs'); //Загружаем объект библиотеки
const {hideBin} = require('yargs/helpers'); //Загружаем вспомогательный метод

const argv = yargs(hideBin(process.argv)).argv; //Преобразуем значимые аргументы

const date = new Date(); //Создаём объект даты
const cmdArr = argv['_']; // Выделяем команды в отдельный массив для удобства

//Осуществляем первоначальное ветвление на current, add и sub
if (cmdArr[0] === 'cmd') {
    if (cmdArr.includes('current')) {
        if (!currentCmdHandler()) {
            console.log(date.toISOString());
        };
    } else if (cmdArr.includes('add')) {
        addsubCmdHandler(1);
    } else if (cmdArr.includes('sub')) {
        addsubCmdHandler(-1);
    }
}

//Работаем с аргументами комманды current
function currentCmdHandler() {
    let flag = false;
    if (argv.year || argv.y) {
        console.log(date.getFullYear());
        flag = true;
    }
    if (argv.month || argv.m) {
        console.log(textMonth(date.getMonth()));
        flag = true;
    }
    if (argv.date || argv.d) {
        console.log(date.getDate());
        flag = true;
    }
    return flag;
}

//Корректируем дату по введенным значениям для комманд add и sub
function addsubCmdHandler(mode) { 

    let years = argv.year || argv.y;
    if (years > 0) {
        date.setFullYear(date.getFullYear() + years * mode);
    }
    let monthes = argv.month || argv.m; 
    if (monthes > 0) {
        date.setMonth(date.getMonth() + monthes * mode);
    } 
    let days = argv.date || argv.d;    
    if (days > 0 ) {
        date.setDate(date.getDate() + days * mode);
    } 
    console.log(date.toISOString());   
}

//Выводим название месяца
function textMonth(month) {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    return months[month];
}

