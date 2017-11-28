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
 * @param {Array.<String>} srcPaths 
 * @returns {Promise.<Array<String>>}
 */
function initiateCPSourceArray(srcPaths) {
    /**
     * https://gist.github.com/kethinov/6658166 #reichert621
     * @param {String} dir A directory path
     * @returns {Array.<String>} contains all js file path in dir
     */
    const findJS = (dir) => {
        try {
            sander.readdirSync(dir)
                .reduce((files, file) =>
                    // Check if a directory
                    sander.statSync(path.join(dir, file)).isDirectory() ?
                    // If yes, research in deep
                    files.concat(findJS(path.join(dir, file))) :
                    // If no, it is a file
                    // Check if it is js file
                    path.extname(file) === 'js' ?
                    // If yes, pick it up
                    files.concat(path.join(dir, file)) :
                    // Otherwise, do nothing
                    '', [])
        } catch (error) {
            return [];
        }
    };
    let jspaths = [];
    srcPaths.forEach(p => {
        try {
            sander.statSync(p).isDirectory ?
                jspaths = jspaths.concat(findJS(p)) :
                // Check if the file exists & it is a js file
                (sander.existsSync(p) && path.extname(p) === 'js') ?
                // If yes, pick it up
                jspaths.push(p) :
                // Else, do nothing
                ''
        } catch (error) {
            // Do nothing
        }
    });
    return Promise.resolve(jspaths);
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

/**
 * Fix the audio path in CPProjInit. All non-js files will be ignored.
 * 
 * @param {Object} settings parsed options from command
 * @param {Array.<String>} settings.src file path or directory to find CPProjInit
 */
function soundfix(settings) {
    initiateCPSourceArray(settings.src)
        .then(function (jspaths) {
            Promise.all(
                jspaths.map((p) =>
                    replaceAudioSrc(p, settings.ulpath)
                    .then((fixedData) => {
                        // Write data
                        return io.exportData(fixedData, p, 'output');
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