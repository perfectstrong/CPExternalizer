/* jshint esversion: 6 */
const CPMExternalizer = require('./CPMExternalizer');
const commandLineArgs = require('command-line-args');
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
        // defaultValue: 'result'
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

// Parse the input command
const cli = commandLineArgs(optionsDefinition);

// Generate list of files and corresponding output prefixes (in the position)
// We depend all on number of input files.
// In case of missing output prefixes, they will be calculated automatically
// base on the input file's basename.
let inputs = [];
let count = 0;
const defaultOutprefix = 'result';
cli.src.forEach((srcPath, pos) => {
    let outprefix = cli.outprefix[pos] || defaultOutprefix + (count++),
        cpname = outprefix + '-CPProjInit.js',
        xcomname = outprefix + '-ExtraComponents.js';
    inputs.push({
        srcPath: srcPath,
        cpPath: cli.outdir + cpname,
        xcomPath: cli.outdir + xcomname
    });
});

// var cpext = new CPMExternalizer(settings.sample, cli.src, outputPath);
// Promise.all([
//         // Preparations
//         cpext.prepare(cpext.inputPath, 'input'),
//         cli.extracomp ? cpext.prepare(cpext.samplePath, 'sample') : Promise.resolve('')
//     ])
//     .then(function() {
//         if (cli.cpproj) {
//             cpext.extractCPProjInit();
//         }
//         if (cli.extracomp) {
//             cpext.extractExtraComponents();
//         }
//     })
//     .catch(function(reason) {
//         console.error(reason);
//     });

var cpext = new CPMExternalizer(settings.sample);
// We build a promise factory that will process every wish
// and continue even if one of them is rejectetd
function treat(input) {
    return Promise.resolve(cpext.setPaths(input));
}