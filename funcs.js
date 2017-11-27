/* jshint esversion: 6 */
const Promise = require('bluebird');
const CPMExternalizer = require('./CPMExternalizer');
const io = require('./util/IOPromise');
const sander = require('sander');
const path = require('path');
const find = require('find');

////////////////////////////////////////////////////////////
// Extract
////////////////////////////////////////////////////////////

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
    io.prepareData(settings.samplePath, 'sample')
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
        .then(initiateCPExtConfig)
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
        .catch(console.log);
}

////////////////////////////////////////////////////////////

////////////////////////////////////////////////////////////
// Soundfix
////////////////////////////////////////////////////////////

/**
 * Finding all CPProjInit files, which has .js and contains cp.CPProjInit
 * 
 * @param {Object} parsedOpt 
 * @returns {Promise.<Array<String>>}
 */
function initiateCPSourceArray(parsedOpt) {
    // WRITE ME
    function walkSync(params) {
        
    }
    let fpathsArray = [];
    parsedOpt.forEach(p => {
        if (path.extname(p) !== '') {
            // If this is a file
            path.extname(p) === 'js' ? fpathsArray.push(path.resolve(p)) : null;
        } else {
            // If this is a path
            // We search in deep and find all js files
            // WRITE ME
        }
    });
    return Promise.resolve([''])
}

/**
 * Fixing the path to audio source
 * 
 * @param {String} srcPath source path
 * @param {String} ulPath unit loader path
 */
function replaceAudioSrc(srcPath, ulPath) {

    /**
     * Path to access to p2 from p1
     * 
     * @param {String} p1 
     * @param {String} p2 
     * @returns {Promise.<String>}
     */
    function diffpath(p1, p2) {
        function filterFilename(p) {
            return p.replace(/[^\/.]*\.[^\/.]+/, "");
        }
        return Promise.resolve(path.relative(filterFilename(p1), filterFilename(p2)).replace(new RegExp('\\' + path.sep, 'g'), '/'));
    }

    /**
     * Regex replacing
     * 
     * @param {String} text 
     * @param {String} diffpath
     * @returns {Promise.<String>}
     */
    function replace(text, diffpath) {
        return Promise.resolve(text.replace(/src: '(ar\/.*)'/gi, "src: '" + diffpath + "/$1'"));
    }

    return Promise.all([io.importData(srcPath, 'input'), diffpath(srcPath, ulPath)]).spread(replace);
}

function soundfix(settings) {
    initiateCPSourceArray(settings)
        .then(function (srcPathArray) {
            Promise.all(
                srcPathArray.map((srcPath) =>
                    replaceAudioSrc(srcPath, settings.ulpath)
                    .then((fixedData) => {
                        // Write data
                        return io.exportData(fixedData, srcPath, 'output');
                    })
                    .catch((error) => {
                        console.log(error);
                        return Promise.resolve('');
                    }))
            );
        })
        .catch(console.log);
}

////////////////////////////////////////////////////////////

////////////////////////////////////////////////////////////
// Help
////////////////////////////////////////////////////////////

function help() {

}

////////////////////////////////////////////////////////////
module.exports = {
    extract: extract,
    soundfix: soundfix,
    help: help
};