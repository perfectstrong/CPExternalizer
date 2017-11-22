/* jshint esversion: 6 */
const beautify = require('js-beautify').js_beautify;
const tlog = require('./tlog');

class Normalizer {
    /**
     * Beautifying the read data from file
     * @param  {String} data data read from file
     * @param  {String} tag type of data
     * @return {Promise}      a resolved promise
     */
    static js(data, tag) {
        tlog(tag, 'Data received. Length = ' + data.length);
        // Beautify data
        tlog(tag, 'Beautifying data...');
        let newData = beautify(data, {});
        tlog(tag, 'Data beautified.');
        return Promise.resolve(newData);
    }
}


module.exports = Normalizer;