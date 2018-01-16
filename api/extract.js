/* jshint esversion: 6 */
const Promise = require('bluebird');
const CPMExternalizer = require('../util/cpmexternalizer');
const io = require('../util/iopromise');
const sander = require('sander');
const path = require('path');
const tlog = require('../util/tlog');
let cachedSampleData = '';

/**
 * Configuration sheet for cpexternalizer
 * 
 * @param {Array.<String>} src
 * @param {Array.<String>} outdir
 * @param {Array.<String>} outprefixes
 * @returns {Array.<{srcPath: String, cpPath: String, xcomPath: String}>}
 */
function initiateCPExtConfig(src, outdir, outprefixes) {
    console.log('Initiating CPExternalizer configuration sheets...')
    let count = 0;
    const defaultOutprefix = 'result';
    let inputs = src.map((srcPath, pos) => {
        let outprefix = outprefixes[pos] || defaultOutprefix + (count++),
            cpname = outprefix + '-CPProjInit.js',
            xcomname = outprefix + '-ExtraComponents.js';
        return {
            srcPath: srcPath,
            cpPath: outdir + cpname,
            xcomPath: outdir + xcomname
        };
    });
    console.log('CPExternalizer configuration sheets initiated.');
    return inputs;
}
/**
 * Create new cpexternalizer corresponding each configuration sheet
 * 
 * @param {Array.<{srcPath: String, cpPath: String, xcomPath: String}>} inputs 
 * @returns {Array.<CPMExternalizer>}
 */
function initiateCPExts(inputs) {
    return inputs.map((cfg) => new CPMExternalizer(cfg));
}

/**
 * 
 * @param {CPMExternalizer} cpext Extractor
 * @param {Boolean} cpproj true to extract the CPProjInit part
 * @returns {Promise}
 */
function runCPProjInitExtractor(cpext, cpproj) {
    return cpproj ? cpext.extractCPProjInit() : '';
}

/**
 * 
 * @param {CPMExternalizer} cpext Extractor
 * @param {Boolean} extracomp true to extract the components that CPM-full.js does not have yet.
 * @returns {Promise}
 */
function runExtraComponentsExtractor(cpext, extracomp) {
    return extracomp && cachedSampleData ? cpext.extractExtraComponents(cachedSampleData) : '';
}

/**
 * Prepare the sample data. Return directly what has been cached for multiple parallel process.
 * 
 * @param {String} samplePath 
 * @returns {Promise} 
 */
function prepareSampleData(samplePath) {
    if (!cachedSampleData) {
        return io.prepareData(samplePath, samplePath + '::sample')
            .then((sampleData) => {
                // On success
                // Caching sample data
                cachedSampleData = sampleData;
                tlog(samplePath + '::sample', 'Data cached & prepared.');
            })
            .catch((reason) => {
                console.warn('CPM-sample.js cannot be loaded. This might cause problem for extracting ExtraComponents.');
                console.error(reason);
            });
    }
}

/**
 * Extracting CPMProjInit and/or ExtraComponents
 * 
 * @param {Array.<String>} src File paths to exported CPM.js by Adobe Captivate
 * @param {String} outdir Where to save output. Default is the current directory
 * @param {Array.<String>} outprefix Prefix of each output. If not defined, it will be 'result'.
 * @param {String} samplePath path to CPM-sample.js
 * @param {Object} flags
 * @param {Boolean} flags.cpproj Flag for extracting CPProjInit. Default: true.
 * @param {Boolean} flags.extracomp Flag for extracting ExtraComponents. Default: false.
 */
function extract(src, outdir, outprefix, samplePath, flags) {
    prepareSampleData(samplePath)
        .then(() => initiateCPExtConfig(src, outdir, outprefix))
        .then(initiateCPExts)
        .then(cpexts =>
            Promise.all(cpexts.map(cpext =>
                runCPProjInitExtractor(cpext, flags.cpproj)
                .then(() => runExtraComponentsExtractor(cpext, flags.extracomp))
                .catch(console.error)
            ))
        )
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

module.exports = {
    extract: extract,
    dirextract: dirExtract
};