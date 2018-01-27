# CPExternalizer
A piece of code to slim down HTML5 module exported by Adobe Captivate.

Checkout [CPExternalizer CLI](https://github.com/perfectstrong/CPExternalizer-CLI) for command line interface or [CPExternalizer GUI](https://github.com/perfectstrong/CPExternalizer-GUI) for graphical interface. See [CPCluster example](https://github.com/perfectstrong/CPCluster-example) to get the whole scenarios for using these tools.

## Usage
````js
const cpext = require('cpexternalizer');
````
CPExternalizer exposes 4 methods each of which returns a promise to chain.

## API References

### extract(src, outdir) => <code>Promise</code>
* <code>{Array.\<String\>}</code> <code>src</code> File paths to CPM.js exported by Adobe Captivate.
* <code>{String}</code> <code>outdir</code> Where to save output. Default is the current directory.

Extracting the initiator(s) from <code>src</code> and export them to <code>outdir</code>.

### xcpextract(src, outdir, samplePath) => <code>Promise</code>
* <code>{Array.\<String\>}</code> <code>src</code> File paths to CPM.js exported by Adobe Captivate.
* <code>{String}</code> <code>outdir</code> Where to save output. Default is the current directory.
* <code>{String}</code> <code>samplePath</code> path to sample CPM.js file

Extracting components in CPM.js which are not covered in sample CPM.js at the moment.

### dirextract(src, outdir) => <code>Promise</code>

* <code>{Array.\<String\>}</code> <code>src</code> input folders
* <code>{String}</code> <code>outdir</code> where to save

Process folders (exported by Adobe Captivate) and return a "slimmed down" one containing only CPProjInit.js, ar and dr.

### soundfix(src, ulpath) => <code>Promise</code>
* <code>{Array.\<String\>}</code> <code>src</code> file path or directory to find CPProjInit
* <code>{String}</code> <code>ulpath</code> file path or directory of common unit loader

Fix the audio path in CPProjInit. All non-js files will be ignored.