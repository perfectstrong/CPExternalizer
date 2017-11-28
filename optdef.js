/**
 * Definition of options for extracing
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
    },
    {
        name: 'outprefix',
        type: String,
        alias: 'p',
        multiple: true,
        defaultValue: [],
        description: 'Prefix of each output. If not defined, it will be calculated automatically.'
    },
    {
        name: 'cpproj',
        type: Boolean,
        alias: 'c',
        defaultValue: true,
        description: 'Flag for extracting CPProjInit. Default: [bold]{true}.'
    },
    {
        name: 'extracomp',
        type: Boolean,
        alias: 'x',
        defaultValue: false,
        description: 'Flag for extracting ExtraComponents. Default: [bold]{false}.'
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
        description: 'Unit loader source path. Usually, the path from unit loader to module should be "down-straight", which means no [bold]{climb} up to any other directory.'
    },
    {
        name: 'src',
        alias: 's',
        type: String,
        multiple: true,
        defaultOption: true,
        defaultValue: [],
        description: 'CPProjInit files and/or directories to find CPProjInit.'
    }
];

module.exports = {
    extract: extractOptDef,
    soundfix: soundfixOptDef
};