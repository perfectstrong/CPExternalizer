/**
 * Definition of options for extracting cpprojinit or extra components
 * @type {Array}
 */
const extractOptDef = [
    {
        name: 'src',
        alias: 's',
        type: String,
        multiple: true,
        defaultOption: true,
        description: 'File paths to exported CPM.js by Adobe Captivate'
    },
    {
        name: 'outdir',
        type: String,
        alias: 'd',
        defaultValue: './',
        description: 'Where to save output. Default is the current directory of cli.js'
    }
];

/**
 * Definition of directory extracting
 * @type {Array}
 */
const dirextractOptDef = [
    {
        name: 'src',
        alias: 's',
        type: String,
        multiple: true,
        defaultOption: true,
        description: 'Path to directory of exported modules'
    },
    {
        name: 'outdir',
        type: String,
        alias: 'd',
        defaultValue: './',
        description: 'Where to save output. Default is the current directory of cli.js'
    }
];

/**
 * Definition of options for fixing sound source
 * @type {Array}
 */
const soundfixOptDef = [
    {
        name: 'ulpath',
        alias: 'u',
        type: String,
        description: 'Unit loader path. Usually, the path from unit loader to module should be "down-straight", which means no [bold]{climb} up to any other directory.'
    },
    {
        name: 'src',
        alias: 's',
        type: String,
        multiple: true,
        defaultOption: true,
        defaultValue: [],
        description: 'Initiator files and/or directories to find initiators. Only accept js files containing "cp.ProjInit". All others are ignored. Advice: Follow the guideline about minimizing module.'
    }
];

module.exports = {
    extract: extractOptDef,
    dirextract: dirextractOptDef,
    soundfix: soundfixOptDef
};