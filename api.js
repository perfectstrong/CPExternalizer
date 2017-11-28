/* jshint esversion: 6 */
const Promise = require('bluebird');
const CPMExternalizer = require('./util/cpmexternalizer');
const io = require('./util/iopromise');
const sander = require('sander');
const path = require('path');
const getUsage = require('command-line-usage');
const optdef = require('./optdef');

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
                        () => {}
                    )
                )
            )
        )
        .catch(console.error);
}

////////////////////////////////////////////////////////////

////////////////////////////////////////////////////////////
// Help
////////////////////////////////////////////////////////////

function help() {
    const sections = [{
            header: 'CPExternalizer',
            content: 'A piece of code to slim down HTML5 module exported by [bold]{Adobe Captivate}.'
        },
        {
            header: 'Synopsis',
            content: [
                'node cli.js <command> <options>'
            ]
        },
        {
            header: 'Command List',
            content: [{
                    name: 'extract',
                    summary: 'Extracting CPProjInit (initiator of module) or/and Extra Components (questions, effects,etc.). This is the default command, executed when no specific command given.'
                },
                {
                    name: 'soundfix',
                    summary: 'Fixing audio source in CPProjInit. Use it when the common loader does not find out the audio files.'
                },
                {
                    name: 'help',
                    summary: 'Manual of this tool.'
                }
            ]
        },
        {
            header: '[bold]{extract} options',
            optionList: optdef.extract
        },
        {
            header: '[bold]{soundfix} options',
            optionList: optdef.soundfix
        }
    ];
    console.log(getUsage(sections));
}

////////////////////////////////////////////////////////////
module.exports = {
    extract: extract,
    soundfix: soundfix,
    help: help
};