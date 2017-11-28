/* jshint esversion: 6 */
const commandLineArgs = require('command-line-args');
const commandLineCommands = require('command-line-commands');
const optdef = require('./optdef');
const api = require('./api');
const importDataSync = require('./util/iopromise').importDataSync;

// Parse the input command
const validCommands = [null, 'extract', 'soundfix', 'help'];
const {command, argv} = commandLineCommands(validCommands);

// Loading the config
let settings = {};
try {
    let d = importDataSync('./config.json', 'settings');
    settings = JSON.parse(d);
    console.log('Settings loaded');
} catch (error) {
    console.log('Settings unloadable.');
    console.error(error);
}

switch(command) {
    case null:
    case 'extract':
        // default action
        api.extract(commandLineArgs(optdef.extract, {argv: argv}));
        break;
    case 'soundfix':
        api.soundfix(commandLineArgs(optdef.soundfix, {argv: argv}));
        break;
    case 'help':
        api.help();
        break;
    default:
        // call help
        console.log('Command not regconized. Please call help by "node cli.js help"');
}