//Init libs
const http = require('http');
const dotenv = require('dotenv');
const yargs = require('yargs');
const {hideBin} = require('yargs/helpers');

//Read command line arguments
const argv = yargs(hideBin(process.argv)).argv;
const cityName = argv._[0];

//Get env varibles
const httpLink = process.env.httpLink;
const accessKey = process.env.weatherAPIKey;

//Format inquery URL
const url = `${httpLink}?access_key=${accessKey}&query=${cityName}`; 

http.get(url, (res) => {
    const statusCode = res.statusCode;
    if (statusCode !== 200) {
        console.error(`Status Code: ${statusCode}`); //Response error info
        return;
    }
    res.setEncoding('utf8');
    let rawData = '';
    res.on('data', (chunk) => { rawData += chunk; });
    res.on('end', () => {
        try {
            const parsedData = JSON.parse(rawData);
            console.log(parsedData);
        } catch (e) {
            console.error(e.message); //Data parse error info
        }
    });

}).on('error', (e) => {
    console.error(`Got error: ${e.message}`); //Get method error info
});


