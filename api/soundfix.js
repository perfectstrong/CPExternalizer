/* jshint esversion: 6 */
const Promise = require('bluebird');
const io = require('../util/iopromise');
const sander = require('sander');
const path = require('path');

/**
 * Finding all CPProjInit files, which has .js and contains cp.CPProjInit
 * 
 * @param {Array.<String>} srcPaths 
 * @returns {Promise.<Array<String>>}
 */
function initiateJSFilesArray(srcPaths) {
    /**
     * https://gist.github.com/kethinov/6658166 #reichert621
     * @param {String} dir A directory path
     * @returns {Array.<String>} contains all js file path in dir
     */
    const findJS = (dir) => {
        try {
            return sander.readdirSync(dir)
                .reduce((files, file) =>
                    sander.statSync(path.join(dir, file)).isDirectory() ?
                        files.concat(findJS(path.join(dir, file))) :
                        files.concat(path.join(dir, file)), [])
                .filter(p => path.extname(p).toLowerCase() === '.js')
        } catch (error) {
            console.log(error);
            return [];
        }
    };
    console.log('Finding all js files...');
    let jspaths = [];
    srcPaths.forEach(p => {
        try {
            console.log('Checking ' + p);
            if (sander.statSync(p).isDirectory()) {
                console.log(p + ' is a dir.');
                jspaths = jspaths.concat(findJS(p));
            } else if (path.extname(p).toLowerCase() === '.js') {
                console.log(p + ' is a js file.');
                jspaths.push(p);
            }
        } catch (error) {
            console.log(error);
        }
    });
    return Promise.resolve(jspaths);
}

/**
 * Check if the file is a cp initiator (containing CPProjInit)
 * 
 * @param {String} text 
 * @returns {Promise.<String>} text itself if true, otherwise ignore
 */
function checkCPProjInit(text) {
    if (text.indexOf('cp.CPProjInit') > -1) {
        return Promise.resolve(text);
    } else {
        return Promise.reject('');
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
 * @param {Object} settings parsed options from command
 * @param {Array.<String>} settings.src file path or directory to find CPProjInit
 * @param {String} settings.ulpath file path or directory of common unit loader
 */
function soundfix(settings) {
    initiateJSFilesArray(settings.src)
        .then(
        (jspaths) => Promise.all(
            jspaths.map(
                p => io.importData(p, 'input').then(checkCPProjInit).then(
                    // If a cpprojinit
                    // Fix it and export it
                    (text) => replaceAudioSrc(text, p, settings.ulpath).then((fixedData) => io.exportData(fixedData, p, 'output')),
                    // Else
                    // Do nothing
                    () => { }
                )
            )
        )
        )
        .catch(console.error);
}