/* jshint esversion: 6 */
const Promise = require('bluebird');
const CPMExternalizer = require('./CPMExternalizer');
const commandLineArgs = require('command-line-args');
const prepareData = require('./util/IOPromise').prepareData;

const optionsDefinition = [{
        name: 'src',
        type: String,
        multiple: true,
        defaultOption: true
    },
    {
        name: 'outdir',
        type: String,
        alias: 'd',
        defaultValue: './'
    },
    {
        name: 'outprefix',
        type: String,
        alias: 'p',
        multiple: true,
        defaultValue: []
    },
    {
        name: 'cpproj',
        type: Boolean,
        alias: 'c',
        defaultValue: true,
    },
    {
        name: 'extracomp',
        type: Boolean,
        alias: 'x',
        defaultValue: false
    }
];

/**
 * Default settings
 * @type {Object}
 */
let settings = {
    /**
     * Path to sample file of comparision
     * @type {String}
     */
    sample: './resources/CPM-sample.js',
    // sample: './resources/CPM-basic.js'
};

///////////////
// Main body //
///////////////
/**
 * Configuration sheet for cpexternalizer
 * 
 * @param {Object} cmd 
 * @returns {Promise.<Array.<{srcPath: String, cpPath: String, xcomPath: String}>>}
 */
function initiateInputs(cmd) {
    let count = 0;
    const defaultOutprefix = 'result';
    let inputs = cmd.src.map((srcPath, pos) => {
        let outprefix = cmd.outprefix[pos] || defaultOutprefix + (count++),
            cpname = outprefix + '-CPProjInit.js',
            xcomname = outprefix + '-ExtraComponents.js';
        return {
            srcPath: srcPath,
            cpPath: cmd.outdir + cpname,
            xcomPath: cmd.outdir + xcomname
        };
    });
    return Promise.resolve(inputs);
}
/**
 * Create new cpexternalizer corresponding each configuration sheet
 * 
 * @param {Array.<{srcPath: String, cpPath: String, xcomPath: String}>} inputs 
 * @returns 
 */
function initiateCPExts(inputs) {
    return Promise.resolve(inputs.map((i) => new CPMExternalizer(i)));
}

// Parse the input command
const cli = commandLineArgs(optionsDefinition);

// Real work
prepareData(settings.sample, 'sample')
    .catch(function(reason) {
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
                return processor.extractCPProjInit().then(() => { return cli.extracomp ? processor.extractExtraComponents(settings.sampleData) : ''; });
            } else {
                return '';
            }
        }));
    })
    .catch((reason) => console.error(reason));