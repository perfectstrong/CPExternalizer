/* jshint esversion: 6 */
const CPMExternalizer = require('./CPMExternalizer');
const commandLineArgs = require('command-line-args');
const optionsDefinition = [
    {
        name: 'src',
        type: String,
        // multiple: true,
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
        // multiple: true
        defaultValue: 'result'
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

function calcOutnameCPProjInit(cmdopt) {
    return cmdopt.outdir + cmdopt.outprefix + '-CPProjInit.js';
}

function calcOutnameExtraComponents(cmdopt) {
    return cmdopt.outdir + cmdopt.outprefix + '-ExtraComponents.js';
}

const cli = commandLineArgs(optionsDefinition);

let outputPath = {
    CPProjInit: calcOutnameCPProjInit(cli),
    ExtraComponents: calcOutnameExtraComponents(cli)
};

var cpext = new CPMExternalizer(settings.sample, cli.src, outputPath);
Promise.all([
        // Preparations
        cpext.prepare(cpext.inputPath, 'input'),
        cli.extracomp ? cpext.prepare(cpext.samplePath, 'sample') : Promise.resolve('')
    ])
    .then(function () {
        if (cli.cpproj) {
            cpext.extractCPProjInit();
        }
        if (cli.extracomp) {
            cpext.extractExtraComponents();
        }
    })
    .catch(function (reason) {
        console.error(reason);
        return Promise.resolve('');
    });