# CPExternalizer
A piece of code to slim down HTML5 module exported by Adobe Captivate.
## Synopsis
    node cli.js <command> <options>
### Example
#### Extracting a module initiator from CPM.js
    node cli.js extract --src path/to/CPM.js --outdir where/to/save
#### Extracting extra components from CPM.js
    node cli.js xcpext --src path/to/CPM.js --outdir where/to/save
#### Slimming down a folder exported
    node cli.js dirext --src path/to/folder --outdir where/to/save
#### Fixing the missing sound of exported initiator
	node cli.js soundfix --src path/to/an/initiator.js --ulpath common/unit/loader

## Command List
| Command | Description |
| ---- | ---- |
| **extract** | Extracting CPProjInit (initiator of module). This is the default command, executed when no specific command given. |
| **xcpext** | Extracting extra components (questions, effects,etc.) which does not exist in CPM-sample.js. |
| **dirext** | Slimming exported folders of Adobe Captivate. |
| **soundfix** | Fixing audio source in CPProjInit. Use it when the common loader does not find out the audio files. |
| **help** | Manual of this tool. |

## extract & xcpext options
| Option | Type | Description |
| ---- | ---- | ---- |
| **-s, --src** | <code>String</code> \| <code>Array.\<String\></code> | File paths to exported CPM.js by Adobe Captivate. |
| **-d, --outdir** | <code>String</code> | Where to save output. Default is <code>./</code> (the current directory of cli.js) |

## dirext options
| Option | Type | Description |
| ---- | ---- | ---- |
| **-s, --src** | <code>String</code> \| <code>Array.\<String\></code> | Path to directory of exported modules. |
| **-d, --outdir** | <code>String</code> | Where to save output. Default is <code>./</code> (the current directory of cli.js) |



## soundfix options
| Option | Type | Description |
| ---- | ---- | ---- |
| **-u, --ulpath** | <code>String</code> | Unit loader source path. Usually, the path from unit loader to module should be "down-straight", which means no climb up other directory. |
| **-s, --src** | <code>String</code> \| <code>Array.\<String\></code> | Initiator files and/or directories to find initiators. Only accept js file. All other types are ignored. |