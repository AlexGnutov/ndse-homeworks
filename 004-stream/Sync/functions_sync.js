const fs = require('fs');
const path = require('path');

//Give random number 1 or 0 as string
function random() {
    const num = Math.random();
    if (num < 0.5) {
        return '0';
    } else {
        return '1';
    }
}

//Sync write logs in file
function logWrite(fileName, result) {
    const data = '$G' + result;
    fs.appendFileSync(fileName, data);    
}

//Sync loads and shows log data
function showLogs(fileName) {
    let dataString = '';
    let logsList = [];

    try {
        dataString = fs.readFileSync(fileName, 'utf-8');        
    } catch (err) {
        console.log(err);
        console.log('Error during logs loading');
    }

    if (dataString.includes('$G')) {
        logsList = dataString.split("$G");
        logsList.forEach(x => x.trim());
        logsList = logsList.filter(x => (x.length > 1));
        
        const games = logsList.length;
        const won = logsList.filter(x => x.includes('USER')).length;
        const percentage = ((won / games) * 100).toFixed(1) + '%';

        console.log(`Games: ${games}, won by user: ${won}, percentage of wins: ${percentage}`)
    }
}

module.exports = {random, logWrite, showLogs};