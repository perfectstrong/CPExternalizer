/* jshint esversion: 6 */
const Promise = require('bluebird');
const {
    exportData,
    importData,
    importDataSync,
    prepareData
} = require('./iopromise');
const tdiff = new(require('text-diff'))({
    timeout: 0
});
const tlog = require('./tlog');
const jsbeautify = require('./normalizer').jsbeautify;

/**
 * Extract the customized js code from assets/js/CPM.js
 * into CPProjInit.js and ExtraComponents.js
 */
class CPMExternalizer {
    /**
     * Define a new processor
     * @param {{srcPath: String, cpPath: String, xcomPath: String}} pathsDescriptior {srcPath: path to input file, cpPath: path to output CPProjInit, xcomPath: path to output ExtraComponents}
     */
    constructor(pathsDescriptior) {
        this.inputPath = pathsDescriptior.srcPath;
        this.cpPath = pathsDescriptior.cpPath;
        this.xcomPath = pathsDescriptior.xcomPath;
        this._cache = {};
    }

    /**
     * Prepare the input data
     * @returns {Promise.<String>} beautified read input
     * @memberof CPMExternalizer
     */
    prepareInput() {
        let self = this;
        if (self._cache[self.inputPath]) {
            return Promise.resolve(self._cache[self.inputPath]);
        } else {
            return prepareData(self.inputPath, self.inputPath + '::input')
                .then(function (beautifiedData) {
                    self._cache[self.inputPath] = beautifiedData;
                    return Promise.resolve(beautifiedData);
                });
        }
    }

    /**
     * Detect the initiation of module.
     * @returns {Promise}
     */
    extractCPProjInit() {
        const markLine = 'cp.sbw = 0;';
        const cptag = this.inputPath + '::CPProjInit';

        /**
         * Extract CPProjInit
         * @param  {String} data Whole text of CPM.js
         * @return {Promise.<String>}      
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

        let self = this;

        // Real work
        return self.prepareInput()
            .then(extract)
            .then(function (extraction) {
                return exportData(extraction, self.cpPath, cptag);
            })
            .then(function () {
                tlog(cptag, 'Extraction completed.');
            })
            .catch(function (reason) {
                tlog(cptag, 'Extraction failed.');
                console.error(reason);
            });
    }

    /**
     * Detect the extra functions adding to CPM.
     * @param {String} preparedSample CPM-basic.js
     * @returns {Promise}
     */
    extractExtraComponents(preparedSample) {
        const markLine = 'cp.sbw = 0;';
        let self = this;
        const intag = self.inputPath + '::ExtraComponents';
        /**
         * Compare to extract components
         * @param  {String} sample Sample resource
         * @param  {String} input  CPM.js to be compared
         * @return {Promise.String}
         */
        function compare(sample, input) {
            // Optimize input
            tlog(intag, 'Optimizing input...');
            input = input.substr(input.indexOf(markLine));
            // Comparing those 2 data
            tlog(intag, 'Comparing input with sample...');
            let diff = tdiff.main(sample, input);
            tdiff.cleanupSemantic(diff);
            diff = diff.filter(part => part[0] === 1).map(part => part[1]);
            return Promise.resolve(diff.join(' ') || '');
        }

        // Real work
        return Promise.all([Promise.resolve(preparedSample), self.prepareInput()])
            .spread(compare)
            .then(function (components) {
                return exportData(components, self.xcomPath, intag);
            })
            .then(function () {
                tlog(intag, 'Components extracting completed.');
            })
            .catch(function (reason) {
                tlog(intag, 'Components extracting failed.');
                console.error(reason);
            });
    }
}

module.exports = CPMExternalizer;