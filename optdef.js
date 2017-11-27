/**
 * Definition of options for extracing
 * @type {Array}
 */
const extractOptDef = [
    {
        /**
         * Exported CPM.js by Adobe Captivate
         */
        name: 'src',
        type: String,
        multiple: true,
        defaultOption: true
    },
    {
        /**
         * Where to save
         */
        name: 'outdir',
        type: String,
        alias: 'd',
        defaultValue: './'
    },
    {
        /**
         * Prefix of each output
         */
        name: 'outprefix',
        type: String,
        alias: 'p',
        multiple: true,
        defaultValue: []
    },
    {
        /**
         * Flag for extracting CPProjInit
         */
        name: 'cpproj',
        type: Boolean,
        alias: 'c',
        defaultValue: true,
    },
    {
        /**
         * Flag for extracting ExtraComponents
         */
        name: 'extracomp',
        type: Boolean,
        alias: 'x',
        defaultValue: false
    }
];

/**
 * Definition of options for fixing sound source
 * @type {Array}
 */
const soundfixOptDef = [
    {
        /**
         * Unit loader source path.
         * Where the loader is.
         */
        name: 'ulpath',
        alias: 'u',
        type: String
    },
    {
        /**
         * CPProjInit.js
         */
        name: 'cpfile',
        alias: 'f',
        type: String,
        multiple: true
    },
    {
        /**
         * Folder contains all modules.
         */
        name: 'cpdir',
        alias: 'd',
        type: String,
        multiple: true
    }
];

module.exports = {
    extract: extractOptDef,
    soundfix: soundfixOptDef
};