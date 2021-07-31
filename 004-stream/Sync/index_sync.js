//Modules init
const {random, logWrite, showLogs} = require('./functions_sync.js');
const fs = require('fs');
const path = require('path');
const yargs = require('yargs');
const {hideBin} = require('yargs/helpers');
const readline = require('readline');

//Get file name from the command line and create correct path
const argv = yargs(hideBin(process.argv)).argv;
const fileName = path.join(__dirname, argv._[0]);

let inGame = false;

//Check is mentioned file exist, if no - make a new empty one (all in Sync mode);
try {
    fs.accessSync(fileName, fs.constants.F_OK);
    console.log(path.parse(fileName)['base'] + ' - log file exist, very good!');
} catch (err) {
    console.error('Log file not exist, so I will add NEW log file');
    try {
        fs.writeFileSync(fileName, '');
        console.log(`Successfully created`);
    } catch (err) {
        console.error('Error in writing file');
    }
}

//Init and guide game process
console.log('Would you like to check you fortune and play a game (y)?');

const input = readline.createInterface(process.stdin);

input.on('line', (data) => {
    if (inGame === true) {
       const number = random(); //Gets random number 1 or 0
       inGame = false;
       if (data === number) {
            console.log('You are lucky! This was really ' + number);
            logWrite(fileName,'USER'); //Saves log data
        } else {
            console.log('You entry is wrong, man... I thought about ' + number);
            logWrite(fileName,'PC'); // --/--
        } 
        showLogs(fileName); //Shows log data
        console.log('Play once again? (y)');           
    } else {
        if (data === "y") {
            console.log('What a number I think of, 1 or 0?');        
            inGame = true;
        } else {
            process.exit(0);
        }    
    }
})



