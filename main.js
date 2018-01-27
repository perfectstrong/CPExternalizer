/* jshint esversion: 6 */
const extract = require('./api/extract');
const soundfix = require('./api/soundfix');

module.exports = {
    extract: extract.extract,
    xcpextract: extract.xcpextract,
    dirextract: extract.dirextract,
    soundfix: soundfix,
};