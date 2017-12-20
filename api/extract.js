/* jshint esversion: 6 */
const Promise = require('bluebird');
const CPMExternalizer = require('../util/cpmexternalizer');
const io = require('../util/iopromise');

/**
 * Configuration sheet for cpexternalizer
 * 
 * @param {Object} parsedOpt
 * @param {Array.<String>} parsedOpt.src
 * @param {Array.<String>} parsedOpt.outprefix
 * @returns {Promise.<Array.<{srcPath: String, cpPath: String, xcomPath: String}>>}
 */
function initiateCPExtConfig(parsedOpt) {
    let count = 0;
    const defaultOutprefix = 'result';
    let inputs = parsedOpt.src.map((srcPath, pos) => {
        let outprefix = parsedOpt.outprefix[pos] || defaultOutprefix + (count++),
            cpname = outprefix + '-CPProjInit.js',
            xcomname = outprefix + '-ExtraComponents.js';
        return {
            srcPath: srcPath,
            cpPath: parsedOpt.outdir + cpname,
            xcomPath: parsedOpt.outdir + xcomname
        };
    });
    return Promise.resolve(inputs);
}
/**
 * Create new cpexternalizer corresponding each configuration sheet
 * 
 * @param {Array.<{srcPath: String, cpPath: String, xcomPath: String}>} inputs 
 * @returns {Promise.<Array.<CPMExternalizer>>}
 */
function initiateCPExts(inputs) {
    return Promise.resolve(inputs.map((i) => new CPMExternalizer(i)));
}

/**
 * 
 * @param {CPMExternalizer} cpext Extractor
 * @param {Object} arguments 
 * @param {Boolean} arguments.cpproj true to extract the CPProjInit part
 * @returns {Promise}
 */
function runCPProjInitExtractor(cpext, arguments) {
    return arguments.cpproj ? cpext.extractCPProjInit() : Promise.resolve(false);
}

/**
 * 
 * @param {CPMExternalizer} cpext Extractor
 * @param {Object} arguments 
 * @param {Boolean} arguments.extracomp true to extract the components that CPM-full.js does not have yet.
 * @param {String} arguments.cachedSampleData
 * @returns {Promise}
 */
function runExtraComponentsExtractor(cpext, arguments) {
    return arguments.extracomp ? cpext.extractExtraComponents(arguments.cachedSampleData) : Promise.resolve(false);
}

/**
 * Extracting CPMProjInit and/or ExtraComponents
 * 
 * @param {Object} arguments configuration of extracting
 * @param {String} samplePath path to CPM-sample.js
 */
function extract(arguments, samplePath) {
    io.prepareData(samplePath, 'sample')
        .catch((reason) => {
            console.log('CPM-sample.js cannot be loaded. This might cause problem for extracting ExtraComponents.');
            console.error(reason);
            return Promise.reject('');
        })
        .then((sampleData) => {
            // On success
            // Caching sample data
            arguments.cachedSampleData = sampleData;
            return Promise.resolve(arguments);
        }, () => {
            // On failure
            // Do nothing. Just redirect flow
            return Promise.resolve(arguments);
        })
        .then(initiateCPExtConfig)
        .then(initiateCPExts)
        .then((cpexts) => {
            Promise.all(cpexts.map((cpext) => {
                return runCPProjInitExtractor(cpext, arguments).then(() => runExtraComponentsExtractor(cpext, arguments));
            }));
        })
        .catch(console.error);
}

module.exports = extract;