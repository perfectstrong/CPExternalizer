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
function initiateInputs(cmd) {
    return Promise.resolve(() => {
        let inputs = [];
        let count = 0;
        const defaultOutprefix = 'result';
        cmd.src.forEach((srcPath, pos) => {
            let outprefix = cmd.outprefix[pos] || defaultOutprefix + (count++),
                cpname = outprefix + '-CPProjInit.js',
                xcomname = outprefix + '-ExtraComponents.js';
            inputs.push({
                srcPath: srcPath,
                cpPath: cmd.outdir + cpname,
                xcomPath: cmd.outdir + xcomname
            });
        });
        return inputs;
    });
}

function initiateCPExts(inputs) {
    return Promise.resolve(() => {
        return inputs.map((i) => new CPMExternalizer(i));
    });
}

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
                return processor.extractCPProjInit().then(() => { return cli.extracomp ? processor.extractExtraComponents() : ''; });
            } else {
                return '';
            }
        }));
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

// var cpext = new CPMExternalizer(settings.sample);

// function to treat each file invidually
// function treat(input) {
//     return Promise.resolve(cpext.setPaths(input))
//         .then(() => Promise.all([
//             cli.cpproj ? cpext.extractCPProjInit() : null,
//             cli.extracomp ? cpext.extractExtraComponents : null
//         ]))
//         .catch(function(reason) {
//             console.error(reason);
//         })
//         .then(() => Promise.resolve(false)); // To continue the chain even failed
// }