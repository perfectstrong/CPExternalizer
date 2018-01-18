/* jshint esversion: 6 */
const getUsage = require('command-line-usage');
const optdef = require('../optdef');

function help() {
    const sections = [{
            header: 'CPExternalizer',
            content: 'A piece of code to slim down HTML5 module exported by [bold]{Adobe Captivate}.'
        },
        {
            header: 'Synopsis',
            content: [
                'node cli.js <command> <options>'
            ]
        },
        {
            header: 'Command List',
            content: [{
                    name: 'extract',
                    summary: 'Extracting CPProjInit (initiator of module). This is the default command, executed when no specific command given.'
                },
                {
                    name: 'xcpext',
                    summary: 'Extracting extra components (questions, effects,etc.) which does not exist in CPM-sample.js.'
                },
                {
                    name: 'dirext',
                    summary: 'Slimming exported folders of Adobe Captivate.'
                },
                {
                    name: 'soundfix',
                    summary: 'Fixing audio source in CPProjInit. Use it when the common loader does not find out the audio files.'
                },
                {
                    name: 'help',
                    summary: 'Manual of this tool.'
                }
            ]
        },
        {
            header: '[bold]{extract} options',
            optionList: optdef.extract
        },
        {
            header: '[bold]{xcpext} options',
            optionList: optdef.extract
        },
        {
            header: '[bold]{dirext} options',
            optionList: optdef.dirextract
        },
        {
            header: '[bold]{soundfix} options',
            optionList: optdef.soundfix
        }
    ];
    console.log(getUsage(sections));
}

module.exports = help;