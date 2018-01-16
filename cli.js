/* jshint esversion: 6 */
const commandLineArgs = require('command-line-args');
const commandLineCommands = require('command-line-commands');
const optdef = require('./optdef');
const api = require('./api');
const importDataSync = require('./util/iopromise').importDataSync;
const tlog = require('./util/tlog');

// Parse the input command
const validCommands = [null, 'extract', 'soundfix', 'help'];
const {
    command,
    argv
} = commandLineCommands(validCommands);

// Loading the config
let settings = {};
let cfgpath = './config.json';
try {
    let d = importDataSync(cfgpath, cfgpath + '::settings');
    settings = JSON.parse(d);
    tlog(cfgpath + '::settings', 'Loaded.');
} catch (error) {
    tlog(cfgpath + '::settings', 'Loading failed.');
    console.error(error);
}

switch (command) {
    case null:
    case 'extract':
        // default action
        let parsedOptions = commandLineArgs(optdef.extract, {
            argv: argv
        });
        api.extract(parsedOptions.src,
            parsedOptions.outdir,
            parsedOptions.outprefix,
            settings.samplePath, {
                cpproj: parsedOptions.cpproj,
                extracomp: parsedOptions.extracomp
            }
        );
        break;
    case 'soundfix':
        let parsedOptions = commandLineArgs(optdef.soundfix, {
            argv: argv
        });
        api.soundfix(
            parsedOptions.src,
            parsedOptions.ulpath
        );
        break;
    case 'help':
        api.help();
        break;
    default:
        // call help
        console.log('Command not regconized. Please call help by "node cli.js help"');
}