/* jshint esversion: 6 */
const Promise = require('bluebird');
const CPMExternalizer = require('./CPMExternalizer');
const prepareData = require('./util/IOPromise').prepareData;

/**
 * Configuration sheet for cpexternalizer
 * 
 * @param {Object} parsedOpt 
 * @returns {Promise.<Array.<{srcPath: String, cpPath: String, xcomPath: String}>>}
 */
function initiateInputs(parsedOpt) {
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
 * @returns {Promise.<CPMExternalizer>}
 */
function initiateCPExts(inputs) {
    return Promise.resolve(inputs.map((i) => new CPMExternalizer(i)));
}

/**
 * Extracting CPMProjInit and/or ExtraComponents
 * 
 * @param {Object} settings configuration of extracting
 * @param {String} settings.samplePath path to CPM-sample.js
 */
function extract(settings) {
    prepareData(settings.samplePath, 'sample')
        .catch(function (reason) {
            console.log('CPM-sample.js cannot be loaded. This might cause problem for extracting ExtraComponents.');
            console.error(reason);
            return Promise.reject('');
        })
        .then((sampleData) => {
            // On success
            // Caching sample data
            settings.sampleData = sampleData;
            return Promise.resolve(cli);
        }, () => {
            // On failure
            // Do nothing. Just redirect flow
            return Promise.resolve(cli);
        })
        .then(initiateInputs)
        .then(initiateCPExts)
        .then((cpexts) => {
            Promise.all(cpexts.map((processor) => {
                if (cli.cpproj) {
                    return processor.extractCPProjInit().then(() => {
                        return cli.extracomp ? processor.extractExtraComponents(settings.sampleData) : '';
                    });
                } else {
                    return '';
                }
            }));
        })
        .catch((reason) => console.error(reason));
}

function soundfix(settings) {
    
}

function help() {
    
}

module.exports = {
    extract: extract,
    soundfix: soundfix,
    help: help
};