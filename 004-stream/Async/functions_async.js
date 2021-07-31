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

//Writes and loads log data in async way
function writeAndShowLogs(fileName, result) {

    const data = '$G' + result;
    let dataString = '';
    let logsList = [];

    fs.appendFile(fileName, data, (err) => {
        if (err) {console.log("Cant write logs");}
        
        fs.readFile(fileName, 'utf-8', (err, data) => {
            if (err) {console.log('Error during logs loading');}
            
            dataString = data;
            if (dataString.includes('$G')) {
                logsList = dataString.split("$G");
                logsList.forEach(x => x.trim());
                logsList = logsList.filter(x => (x.length > 1));
                
                const games = logsList.length;
                const won = logsList.filter(x => x.includes('USER')).length;
                const percentage = ((won / games) * 100).toFixed(1) + '%';
        
                console.log(`Games: ${games}, won by user: ${won}, percentage of wins: ${percentage}`)
            }
            console.log('Play once again? (y)');
        }); 
    });  
}
   
module.exports = {random, writeAndShowLogs};