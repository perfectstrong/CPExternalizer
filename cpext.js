/* jshint esversion: 6 */
var Promise = require('bluebird');
var fs = Promise.promisifyAll(require('fs'));
var beautify = require('js-beautify').js_beautify;
var jsdiff = require('diff');
const path = require('path');
/**
 * Default options
 * @type {Object}
 */
let options = {
    /**
     * Encoding of file.
     * @default 'utf8'
     * @type {String}
     */
    encode: 'utf8',

    /**
     * Path to sample file of comparision
     * @type {String}
     */
    sample: './resources/CPM-sample.js',

    /**
     * Location to store the output
     * @type {String}
     */
    outputDir: './test/'
};

let settings = {
    // input: './test/CPM-A11.js',
    // input: './test/1.js',
    // outputCPProjInit: options.outputDir + 'CPProjInit.js',
    // outputAutoShape: options.outputDir + 'AutoShape.js'
};

// Custom style of log
console.tlog = function() {
    let args = Array.from(arguments);
    let tag = args.shift();
    console.log(tag + '::' + args.join(' '));
};

/**
 * Beautifying the read data from file
 * @param  {String} data data read from file
 * @param  {String} tag type of data
 * @return {Promise}      a resolved promise
 */
function normalize(data, tag) {
    console.tlog(tag, 'Data received. Length = ' + data.length);
    // Beautify data
    console.tlog(tag, 'Beautifying data...');
    let newData = beautify(data, {}); // Assuming no error returned
    console.tlog(tag, 'Data beautified.');
    return Promise.resolve(newData);
}

/**
 * Exporting data into a file
 * @param  {String} newData data to be written
 * @param  {String} input filepath
 * @param  {String} tag type of data
 * @return {Promise}         fs.writeFileAsync
 */
function exportData(newData, filepath, tag) {
    console.tlog(tag, 'Exporting data to ' + filepath);
    return fs.writeFileAsync(filepath, newData, options.encode);
}

/**
 * Wrapper of fs.readFileAsync
 * @param  {String} input filepath
 * @param  {String} tag type of data
 * @return {Promise}        fs.readFileAsync
 */
function readData(filepath, tag) {
    console.tlog(tag, 'Reading data from ' + filepath + '...');
    return fs.readFileAsync(filepath, options.encode);
}

function prepare(filepath, tag) {
    console.tlog(tag, 'Preparing ' + filepath + '...');
    return readData(filepath, tag)
        .then(function(data) {
            return normalize(data, tag);
        });
}

function compare(sample, input) {
    // Comparing those 2 data
    console.log('Comparing data...');
    var diff = jsdiff.diffTrimmedLines(sample, input)
        .filter(part => part.added)
        .map((part) => {
            return part.value;
        });
    // There will be two elements of differences
    // The first contains general objects defined in module
    // The second contains shapes' definition
    return Promise.resolve({
        CPProjInit: diff[0] || '',
        AutoShape: diff[1] || ''
    });
}


///////////////
// Main body //
///////////////

let args = process.argv.slice(2);
let input = args[0];
// input = './test/1.js';
// options.sample = './test/2.js';
settings.input = input;
settings.outputCPProjInit = options.outputDir + path.basename(input, path.extname(input)) + '-CPProjInit.js';
settings.outputAutoShape = options.outputDir + path.basename(input, path.extname(input)) + '-AutoShape.js';

Promise.all([prepare(options.sample, 'sample'), prepare(settings.input, 'input')])
    .then(function(array) {
        console.log('Data sample and input prepared.');
        return compare(array[0], array[1]);
    })
    .then(function(ingredients) {
        return Promise.all([
            normalize(ingredients.CPProjInit, 'CPProjInit')
            .then(function(CPProjInit) {
                return exportData(CPProjInit, settings.outputCPProjInit, 'CPProjInit');
            }),
            normalize(ingredients.AutoShape, 'AutoShape')
            .then(function(AutoShape) {
                return exportData(AutoShape, settings.outputAutoShape, 'AutoShape');
            })
        ]);
    })
    .then(function() {
        console.log('Comparision completed.');
    })
    .catch(function(reason) {
        console.log('Comparision failed.');
        console.error(reason);
    });