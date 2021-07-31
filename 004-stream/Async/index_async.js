//Modules init
const {random, writeAndShowLogs} = require('./functions_async.js');
const fs = require('fs');
const path = require('path');
const yargs = require('yargs');
const {hideBin} = require('yargs/helpers');
const readline = require('readline');

//Get file name from the command line and create correct path
const argv = yargs(hideBin(process.argv)).argv;
const fileName = path.join(__dirname, argv._[0]);

//Status varible
let inGame = false;

//Check, if log file is available, make new if not
fs.access(fileName, fs.constants.F_OK, (err) => {
    if (err) {
        console.warn('No log file, NEW log file created');
        fs.writeFile(fileName, '', (err) => {
            if (err) {
                console.error('Error in writing file');
            }
            gamePlay();         
        });
    } else {
        gamePlay();
    }
});

//Init game and guide game process
function gamePlay() {
    console.log('Would you like to check you fortune and play a game (y)?');
    const input = readline.createInterface(process.stdin);
    
    input.on('line', (data) => {
        if (inGame === true) {
        const number = random(); //To have 1 or 0
        inGame = false;
        if (data === number) {
                console.log('You are lucky! This was really ' + number);
                writeAndShowLogs(fileName,'USER'); //To save log and load data
            } else {
                console.log('You entry is wrong, man... I thought about ' + number);
                writeAndShowLogs(fileName,'PC'); // --/--
            }                   
        } else {
            if (data === "y") {
                console.log('What a number I think of, 1 or 0?');        
                inGame = true;
            } else {
                process.exit(0);
            }    
        }
    })
}


