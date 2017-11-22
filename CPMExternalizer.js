/* jshint esversion: 6 */
const Promise = require('bluebird');
const IOPromise = require('./util/IOPromise');
const jsdiff = require('diff');
const tlog = require('./util/tlog');
const Normalizer = require('./util/Normalizer');

/**
 * Extract the customized js code from assets/js/CPM.js
 * into CPProjInit.js and AutoShape.js
 */
class CPMExternalizer {
    constructor(samplePath, inputPath, outputPath) {
        this.samplePath = samplePath;
        this.inputPath = inputPath;
        this.outputPath = outputPath;
    }

    prepare(filepath, tag) {
        tlog(tag, 'Preparing ' + filepath + '...');
        return IOPromise.import(filepath, tag)
            .then(function(data) {
                return Normalizer.js(data, tag);
            });
    }

    compare(sample, input) {
        // Comparing those 2 data
        console.log('Comparing data...');
        var diff = jsdiff.diffTrimmedLines(sample, input)
            ;
            // .filter(part => part.added)
            // .map((part) => {
            //     return part.value;
            // });
        console.log(diff);
        // There will be two elements of differences
        // The first contains general objects defined in module
        // The second contains shapes' definition
        return Promise.resolve({
            CPProjInit: diff[0],
            AutoShape: diff[1]
        });
    }

    run() {
        let self = this;
        Promise.all([
                self.prepare(self.samplePath, 'sample'),
                self.prepare(self.inputPath, 'input')
            ])
            .then(function(array) {
                console.log('Data sample and input prepared.');
                console.log(array[0].slice(0, 100));
                console.log(array[1].slice(0, 100));
                return self.compare(array[0], array[1]);
            })
            .then(function(ingredients) {
                return Promise.all([
                    Normalizer.js(ingredients.CPProjInit, 'CPProjInit')
                    .then(function(CPProjInit) {
                        return IOPromise.export(CPProjInit, self.outputPath.CPProjInit, 'CPProjInit');
                    }),
                    Normalizer.js(ingredients.AutoShape, 'AutoShape')
                    .then(function(AutoShape) {
                        return IOPromise.export(AutoShape, self.outputPath.AutoShape, 'AutoShape');
                    })
                ]);
            })
            .then(function() {
                console.log(self.inputPath + '>>>>CPM extracting completed.');
            })
            .catch(function(reason) {
                console.log(self.inputPath + '>>>>CPM extracting failed.');
                console.error(reason);
            });
    }
}


module.exports = CPMExternalizer;