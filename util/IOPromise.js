/* jshint esversion: 6 */
const tlog = require('./tlog');
const sander = require('sander');

class IOPromise {
    /**
     * Export data
     * @param  {String} data data to be written
     * @param  {String} input filepath
     * @param  {String} tag type of data
     * @param  {String} encoding
     * @return {Promise}
     */
    static export(data, filepath, tag, encoding) {
        tlog(tag, 'Exporting data to ' + filepath);
        encoding = encoding || 'utf8';
        return sander.writeFile(filepath, data, {encoding: encoding});
    }

    /**
     * Import data
     * @param  {String} input filepath
     * @param  {String} tag type of data
     * @param  {String} encoding
     * @return {Promise}
     */
    static import(filepath, tag, encoding) {
        tlog(tag, 'Reading data from ' + filepath + '...');
        encoding = encoding || 'utf8';
        return sander.readFile(filepath, {encoding: encoding});
    }
}

module.exports = IOPromise;