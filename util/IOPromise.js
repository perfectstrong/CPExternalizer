/* jshint esversion: 6 */
const tlog = require('./tlog');
const sander = require('sander');
const jsbeautify = require('./Normalizer').jsbeautify;

/**
 * Export data
 * @param  {String} data data to be written
 * @param  {String} input filepath
 * @param  {String} tag type of data
 * @param  {String} [encoding=utf8]
 * @return {Promise} Data
 */
function exportData(data, filepath, tag, encoding) {
    tlog(tag, 'Exporting data to ' + filepath);
    encoding = encoding || 'utf8';
    return sander.writeFile(filepath, data, { encoding: encoding });
}

/**
 * Import data
 * @param  {String} filepath filepath
 * @param  {String} tag type of data
 * @param  {String} [encoding=utf8]
 * @return {Promise.<String>} Data
 */
function importData(filepath, tag, encoding) {
    tlog(tag, 'Reading data from ' + filepath + '...');
    encoding = encoding || 'utf8';
    return sander.readFile(filepath, { encoding: encoding });
}

/**
 * Import data synchronously
 * @param  {String} input filepath
 * @param  {String} tag type of data
 * @param  {String} [encoding=utf8]
 * @return {String} Data
 */
function importDataSync(filepath, tag, encoding) {
    tlog(tag, 'Reading data...');
    encoding = encoding || 'utf8';
    return sander.readFileSync(filepath, { encoding: encoding });
}

/**
 * Read data and beautify it
 * @param  {String} filepath Path
 * @param  {String} tag type of data
 * @return {Promise.<String>}          Beautified data
 */
function prepareData(filepath, tag) {
    tlog(tag, 'Preparing ' + filepath + '...');
    return importData(filepath, tag)
        .then(function(data) {
            return jsbeautify(data, tag);
        });
}

module.exports = {
    exportData: exportData,
    importData: importData,
    importDataSync: importDataSync,
    prepareData: prepareData
};