/* jshint esversion: 6 */
const Promise = require('bluebird');
const io = require('../util/iopromise');
const sander = require('sander');
const path = require('path');
const tlog = require('../util/tlog');

/**
 * Finding all js files
 * 
 * @param {Array.<String>} srcPaths 
 * @returns {Promise.<Array<String>>}
 */
function initiateJSFilesArray(srcPaths) {
    tlog('', 'Finding all js files...');
    const findJS = dir =>
        sander.lsrSync(dir)
            .filter(p => path.extname(p).toLowerCase() === '.js')
            .map(p => path.join(dir, p));
    let jspaths = [];
    srcPaths
        .map(p => path.normalize(p))
        .forEach(p => {
            try {
                tlog(p, 'Checking if a js file...');
                if (sander.statSync(p).isDirectory()) {
                    tlog(p, 'A dir. Finding inside.');
                    jspaths = jspaths.concat(findJS(p));
                } else if (path.extname(p).toLowerCase() === '.js') {
                    tlog(p, 'A js file. Picked.');
                    jspaths.push(p);
                }
            } catch (error) {
                console.error(error);
            }
        });
    return Promise.resolve(jspaths);
}

/**
 * Check if the file is a cp initiator (containing CPProjInit)
 * 
 * @param {String} text 
 * @returns {Promise.<String>} text itself if true, otherwise rejected promise
 */
function checkCPProjInit(text) {
    if (text.indexOf('cp.CPProjInit') > -1) {
        return Promise.resolve(text);
    } else {
        return Promise.reject('Not a cp initiator. Ingored.');
    }
}

/**
 * Fixing the path to audio source. If src path is not a cpprojinit, it will be ignored.
 * 
 * @param {String} text content of file (should be verified by checkCPProjInit beforehand)
 * @param {String} srcPath source path
 * @param {String} ulPath unit loader path
 * @returns {Promise.<String>} data after fixing all audio source
 */
function replaceAudioSrc(text, srcPath, ulPath) {

    /**
     * Calculate the difference in path
     * 
     * @param {String} from 
     * @param {String} to 
     * @returns {Promise.<String>}
     */
    function diffpath(from, to) {
        function filterFilename(p) {
            if (path.extname(p) !== '') {
                return p.replace(path.basename(p), "");
            } else {
                return p;
            }
        }
        return Promise.resolve(path.relative(filterFilename(from), filterFilename(to)).replace(new RegExp('\\' + path.sep, 'g'), '/'));
    }

    /**
     * Regex replacing
     * 
     * @param {String} text 
     * @param {String} diffpath
     * @returns {Promise.<String>}
     */
    function replace(text, diffpath) {
        return Promise.resolve(text.replace(/src(\s*:\s*)'.*(ar\/.*)'/gi, "src$1'" + diffpath + "/$2'"));
    }

    return diffpath(ulPath, srcPath).then((dp) => replace(text, dp));
}

/**
 * Fix the audio path in CPProjInit. All non-js files will be ignored.
 * 
 * @param {Array.<String>} src file path or directory to find CPProjInit
 * @param {String} ulpath file path or directory of common unit loader
 * @returns {Promise}
 */
function soundfix(src, ulpath) {
    return initiateJSFilesArray(src)
        .then(jspaths =>
            Promise.all(jspaths.map(p =>
                io.importData(p, p + '::input')
                    .then(checkCPProjInit)
                    .then(
                    // If a cpprojinit
                    // Fix it and export it
                    text => replaceAudioSrc(text, p, ulpath).then(fixedData => io.exportData(fixedData, p, p + '::output')),
                    // If not a cpprojinit
                    // Print the reject's reason
                    reason => tlog(p, reason)
                    )
                    .catch(console.error)
            ))
        )
        .catch(console.error);
}

module.exports = soundfix;