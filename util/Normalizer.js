/* jshint esversion: 6 */
const beautify = require('js-beautify').js_beautify;
const tlog = require('./tlog');

/**
 * Beautifying the read js data from file
 * @param  {String} data js data read from file
 * @param  {String} tag type of data
 * @return {Promise}      a resolved promise
 */
function jsbeautify(data, tag) {
    tlog(tag, 'Received. Length = ' + data.length);
    // Beautify data
    tlog(tag, 'Beautifying...');
    let newData = beautify(data, {
        "eol": "\r\n"
    });
    tlog(tag, 'Beautified.');
    return Promise.resolve(newData);
}


module.exports.jsbeautify = jsbeautify;