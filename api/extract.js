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
 * @returns {Array.<{srcPath: String, cpPath: String, xcomPath: String}>}
 */
function initiateCPExtConfig(src, outdir) {
    console.log('Initiating CPExternalizer configuration sheets...');
    let inputs = [];
    let count = -1;
    if (src.length > 1) {
        inputs = src.map((srcPath, pos) => {
            let (count++),
            cpname = 'CPProjInit' + '_' + count + '.js',
                xcomname = 'ExtraComponents' + '_' + count + '.js';
            return {
                srcPath: path.resolve(srcPath),
                cpPath: path.resolve(outdir, cpname),
                xcomPath: path.resolve(outdir, xcomname)
            };
        });
    } else {
        inputs = [{
            srcPath: path.resolve(src[0]),
            cpPath: path.resolve(outdir, 'CPProjInit.js'),
            xcomPath: path.resolve(outdir, 'ExtraComponents.js')
        }];
    }
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
    return inputs.map(cfg => new CPMExternalizer(cfg));
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
                tlog(samplePath + '::sample', 'Cached & prepared.');
            });
    } else {
        return Promise.resolve();
    }
}

/**
 * Extracting CPMProjInit
 * 
 * @param {Array.<String>} src File paths to CPM.js exported by Adobe Captivate
 * @param {String} outdir Where to save output. Default is the current directory
 */
function extract(src, outdir) {
    Promise.resolve()
        .then(() => initiateCPExtConfig(src, outdir))
        .then(initiateCPExts)
        .then(cpexts =>
            Promise.all(cpexts.map(cpext => cpext.extractCPProjInit().catch(console.error)))
        )
        .catch(console.error);
}

/**
 * Extracting components in CPM.js which does not exist in CPM-sample.js at moment
 * 
 * @param {Array.<String>} src File paths to exported CPM.js by Adobe Captivate
 * @param {String} outdir Where to save output. Default is the current directory
 * @param {String} samplePath path to CPM-sample.js
 */
function xcpExtract(src, outdir, samplePath) {
    prepareSampleData(samplePath)
        .then(() => initiateCPExtConfig(src, outdir))
        .then(initiateCPExts)
        .then(cpexts =>
            Promise.all(cpexts.map(cpext => cpext.extractExtraComponents(cachedSampleData).catch(console.error)))
        )
        .catch(console.error);
}

/**
 * Treat the dir and push the result to dest
 * 
 * @param {String} dir 
 * @param {String} dest 
 * @returns 
 */
function dirProcessing(dir, dest) {
    // Create the new directory at output place
    return sander.mkdir(dest)
        .then(() => {
            tlog(dir, 'Copying audio files...');
            sander.copydir(dir, 'ar').to(dest, 'ar');
        }).then(() => {
            tlog(dir, 'Copying images files...');
            sander.copydir(dir, 'dr').to(dest, 'dr');
        }).then(() => {
            let cpmpath = path.resolve(dir, 'assets/js/CPM.js');
            tlog(cpmpath, 'Processing...');
            extract([cpmpath], dest);
        }).catch(console.error);
}

/**
 * Process folders (exported by Adobe Captivate) and return a "slimmed down" one containing only CPProjInit.js, ar and dr.
 * 
 * @param {Array.<String>} src input folders
 * @param {String} outdir where to save
 */
function dirExtract(src, outdir) {
    let configs = src.map((dir, pos) => {
        return {
            dir: dir,
            dest: outdir + path.basename(dir)
        };
    });
    Promise.all(configs.map(cfg => dirProcessing(cfg.dir, cfg.dest)))
        .catch(console.error);
}

module.exports = {
    extract: extract,
    xcpextract: xcpExtract,
    dirextract: dirExtract
};