/* jshint esversion: 6 */
const CPMExternalizer = require('./CPMExternalizer');

/**
 * Default options
 * @type {Object}
 */
let options = {
    /**
     * Path to sample file of comparision
     * @type {String}
     */
    sample: './resources/CPM-sample.js',
    // sample: './test/2.js',

    /**
     * Location to store the output
     * @type {String}
     */
    outputDir: './test/'
};

let settings = {
    input: './test/CPM.js',
    // input: './test/1.js',
    output : {
        CPProjInit: options.outputDir + 'CPProjInit.js',
        AutoShape: options.outputDir + 'AutoShape.js'
    }    
};


///////////////
// Main body //
///////////////
var extractor = new CPMExternalizer(options.sample, settings.input, settings.output);
extractor.run();