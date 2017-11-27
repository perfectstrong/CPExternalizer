/**
 * Definition of options for extracing
 * @type {Array}
 */
const extractOptDef = [{
        name: 'src',
        type: String,
        multiple: true,
        // defaultOption: true
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
 * Definition of options for fixing sound source
 * @type {Array}
 */
const soundfixOptDef = [
    {
        name: 'ulsrc',
        type: String
    },
    {
        name: 'cpsrc',
        type: String,
        multiple: true
    },
    {
        name: 'cpdir',
        type: String,
        multiple: true
    }
];

module.exports = {
    extract: extractOptDef,
    soundfix: soundfixOptDef
};