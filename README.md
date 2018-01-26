# CPExternalizer
A piece of code to slim down HTML5 module exported by Adobe Captivate.

Check out [CPCluster example](https://github.com/perfectstrong/CPCluster-example) to get the whole scenarios for using this tool.

## Getting started with source
_**Requirements**_:
* Node >=8.6.0
* Electron (for GUI) >= 1.7.11

````bash
git clone https://github.com/perfectstrong/CPExternalizer
cd CPExternlizer
npm install
npm run start:e # to run GUI, see the Graphical User Interface
node cli.js <command> <options> # to run CLI, see the Command Line Interface
````

## Graphical User Interface
_Built with [Electron](https://github.com/electron/electron) and [Photon](https://github.com/connors/photon)._

There are 4 sections corresponding to 4 features of this software:

### Folder slimmer
The main functionality of program. It will pick up specific folders (ar, dr) and CPM.js after stripping off what is not project's private data.

### Sound fixing
If your project contains sounds, they may be missed after slimming down, because of the changements in directory. Use this to fix it.

### Project initiator
The core of folder slimmer. In case you want to treat some certains CPM.js.

### Extra componenents
Bring out components not installed yet in your common CPM.js.

## Command Line Interface
This is the machine behind GUI.

### Synopsis
    node cli.js <command> <options>
#### Example
##### Extracting a module initiator from CPM.js
    node cli.js extract --src path/to/CPM.js --outdir where/to/save
##### Extracting extra components from CPM.js
    node cli.js xcpext --src path/to/CPM.js --outdir where/to/save
##### Slimming down a folder exported
    node cli.js dirext --src path/to/folder --outdir where/to/save
##### Fixing the missing sound of exported initiator
	node cli.js soundfix --src path/to/an/initiator.js --ulpath common/unit/loader

### Command List
| Command | Description |
| ---- | ---- |
| **extract** | Extracting CPProjInit (initiator of module). This is the default command, executed when no specific command given. |
| **xcpext** | Extracting extra components (questions, effects,etc.) which is not coverd in the common CPM.js. |
| **dirext** | Slimming exported folders of Adobe Captivate. |
| **soundfix** | Fixing audio source in CPProjInit. Use it when the common loader does not find out the audio files. |
| **help** | Manual of this tool. |

### extract & xcpext options
| Option | Type | Description |
| ---- | ---- | ---- |
| **-s, --src** | <code>String</code> \| <code>Array.\<String\></code> | File paths to exported CPM.js by Adobe Captivate. |
| **-d, --outdir** | <code>String</code> | Where to save output. Default is <code>./</code> (the current directory of cli.js) |

### dirext options
| Option | Type | Description |
| ---- | ---- | ---- |
| **-s, --src** | <code>String</code> \| <code>Array.\<String\></code> | Path to directory of exported modules. |
| **-d, --outdir** | <code>String</code> | Where to save output. Default is <code>./</code> (the current directory of cli.js) |

### soundfix options
| Option | Type | Description |
| ---- | ---- | ---- |
| **-u, --ulpath** | <code>String</code> | Unit loader source path. Usually, the path from unit loader to module should be "down-straight", which means no climb up other directory. |
| **-s, --src** | <code>String</code> \| <code>Array.\<String\></code> | Initiator files and/or directories to find initiators. Only accept js file. All other types are ignored. |