/* jshint esversion: 6 */
const Promise = require('bluebird');
const {
    exportData,
    importData,
    importDataSync
} = require('./util/IOPromise');
const tdiff = new(require('text-diff'))({
    timeout: 0
});
const tlog = require('./util/tlog');
const jsbeautify = require('./util/Normalizer').jsbeautify;
/**
 * Extract the customized js code from assets/js/CPM.js
 * into CPProjInit.js and ExtraComponents.js
 */
class CPMExternalizer {
    /**
     * Define a new processor
     * @param  {String} samplePath Path to the sample CPM
     * @param  {String} inputPath  Path to CPM.js to be compared
     * @param  {Object} outputPath Where to save the result of CPProjInit and ExtraComponents
     */
    constructor(samplePath, inputPath, outputPath) {
        this.samplePath = samplePath;
        this.inputPath = inputPath;
        this.outputPath = outputPath;
        this._cache = {};
    }

    /**
     * Read data and beautify it
     * @param  {String} filepath Path
     * @param  {String} tag type of data
     * @return {Promise}          Containing beautified data
     */
    prepare(filepath, tag) {
        tlog(tag, 'Preparing ' + filepath + '...');
        let self = this;
        if (this._cache[filepath]) {
            return Promise.resolve(self._cache[filepath]);
        } else {
            return importData(filepath, tag)
                .then(function(data) {
                    return jsbeautify(data, tag);
                })
                .then(function(beautifiedData) {
                    // Caching
                    self._cache[filepath] = beautifiedData;
                    tlog(tag, filepath + ' prepared.');
                    return Promise.resolve();
                });
        }
    }


    /**
     * Detect the initiation of module.
     */
    extractCPProjInit() {
        const markLine = 'cp.sbw = 0;';
        const cptag = this.inputPath + ':CPProjInit';

        /**
         * Extract CPProjInit
         * @param  {String} data Whole text of CPM.js
         * @return {Promise}      
         */
        function extract(data) {
            tlog(cptag, 'Finding cut point...');
            let cutPoint = data.indexOf(markLine);
            if (cutPoint !== -1) {
                tlog(cptag, 'Cut point found:' + cutPoint);
                tlog(cptag, 'Extracting...');
                return Promise.resolve(data.substring(0, cutPoint - 1));
            } else {
                return Promise.reject('Cut point not found.');
            }
        }

        var self = this;

        extract(self._cache[self.inputPath])
            .then(function(extraction) {
                return exportData(extraction, self.outputPath.CPProjInit, cptag);
            })
            .then(function() {
                tlog(cptag, 'Extraction completed.');
            })
            .catch(function(reason) {
                tlog(cptag, 'Extraction failed.');
                console.error(reason);
            });
    }

    /**
     * Detect the extra functions adding to CPM and writing it to a file.
     */
    extractExtraComponents() {

        var self = this;
        const intag = self.inputPath + ':ExtraComponents';
        /**
         * Compare to extract components
         * @param  {String} sample Sample resource
         * @param  {String} input  CPM.js to be compared
         * @return {Promise}        {ExtraComponents: String}
         */
        function compare(sample, input) {
            // Comparing those 2 data
            tlog(intag, 'Comparing input with sample...');
            var diff = tdiff.main(sample, input)
                .filter(part => part[0] === 1)
                .map((part) => {
                    return part[1];
                });
            // There will be two elements of differences.
            // The first is CPProjInit
            // containing general objects defined in module.
            // The second is extra components
            diff.shift(); // Eliminate CPProjInit
            return Promise.resolve(diff.join(' ') || '');
        }

        compare(self._cache[self.samplePath], self._cache[self.inputPath])
            .then(function(components) {
                return jsbeautify(components, intag);
            })
            .then(function(beautifiedComponents) {
                return exportData(beautifiedComponents, self.outputPath.ExtraComponents, intag);
            })
            .then(function() {
                tlog(intag, 'Components extracting completed.');
            })
            .catch(function(reason) {
                tlog(intag, 'Components extracting failed.');
                console.error(reason);
            });
    }
}

module.exports = CPMExternalizer;