/* jshint esversion: 6 */
const Promise = require('bluebird');
const CPMExternalizer = require('../util/cpmexternalizer');
const io = require('../util/iopromise');
const sander = require('sander');
const path = require('path');
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
    return arguments.extracomp && arguments.cachedSampleData ? cpext.extractExtraComponents(arguments.cachedSampleData) : Promise.resolve(false);
}

/**
 * Prepare the sample data. Return directly what has been cached for multiple parallel process.
 * 
 * @param {Object} arguments 
 * @param {String} samplePath 
 * @returns {Object} the arguments including the sample data (if loaded successuflly)
 */
function prepareSampleData(arguments, samplePath) {
    if (arguments.cachedSampleData) {
        return Promise.resolve(arguments);
    } else {
        return io.prepareData(samplePath, 'sample')
            .then((sampleData) => {
                // On success
                // Caching sample data
                arguments.cachedSampleData = sampleData;
                return Promise.resolve(arguments);
            })
            .catch((reason) => {
                console.log('CPM-sample.js cannot be loaded. This might cause problem for extracting ExtraComponents.');
                console.error(reason);
                return Promise.resolve(arguments);
            });
    }
}

/**
 * Extracting CPMProjInit and/or ExtraComponents
 * 
 * @param {Object} arguments configuration of extracting
 * @param {String} samplePath path to CPM-sample.js
 */
function extract(arguments, samplePath) {
    prepareSampleData(arguments, samplePath)
        .then(initiateCPExtConfig)
        .then(initiateCPExts)
        .then((cpexts) => {
            Promise.all(cpexts.map((cpext) => {
                return runCPProjInitExtractor(cpext, arguments)
                    .then(() => runExtraComponentsExtractor(cpext, arguments));
            }));
        })
        .catch(console.error);
}

function dirProcessing(dir, outdir) {
    let dest;
    return sander.lstat(dir).then((stat) => {
        if (stat.isDirectory()) {
            dest = outdir + path.sep + path.basename(dir);
        } else {
            throw new Error(dir + ' is not a directory.');
        }
    }).then(() => {
        // Create the new directory at output place
        return sander.mkdir(dest);
    }).then(() => {
        // Copy audio files
        return sander.copydir(dir + path.sep + 'ar').to(dest + path.sep + 'ar');
    }).then(() => {
        // Copy images
        return sander.copydir(dir + path.sep + 'dr').to(dest + path.sep + 'dr');
    }).then(() => {
        // Process the CPM.js
        // TODO
    }).catch(console.error);
}

/**
 * Process a folder (exported by Adobe Captivate) and return a "slimmed down" one containing only CPProjInit.js, ar and dr.
 * 
 * @param {Object} arguments the parsed options
 */
function dirExtract(arguments) {
    let dirList = arguments.src || [];
    Promise.all(dirList.map(dirProcessing))
        .catch(console.error);
}

module.exports = extract;