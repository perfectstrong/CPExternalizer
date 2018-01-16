/* jshint esversion: 6 */
const extract = require('./api/extract');
const soundfix = require('./api/soundfix');
const help = require('./api/help');

module.exports = {
    extract: extract.extract,
    dirextract: extract.dirextract,
    soundfix: soundfix,
    help: help
};