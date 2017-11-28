# CPExternalizer
A piece of code to slim down HTML5 module exported by Adobe Captivate.
## Synopsis
    node cli.js <command> <options>
### Example
#### To extract module initiator from multiple CPM.js:
    node cli.js --src first/path/to/CPM.js second/path/to/CPM.js --outdir where/to/save
#### To fix the missing sound of exported initiators:
	node cli.js --src path/to/a/initiator.js dir/containing/initiator -ulpath common/unit/loader
## Command List
* **extract** Extracting CPProjInit (initiator of module) or/and Extra Components (questions, effects,etc.). This is the default command, executed when no specific command given. 
* **soundfix** Fixing audio source in CPProjInit. Use it when the common loader does not find out the audio files.
* **help** Manual of this tool.
## extract options
*  **-s, --src**                  File paths to exported CPM.js by Adobe Captivate. Can be multiple.
*  **-d, --outdir**               Where to save output. Default is the current directory of cli.js
*  **-p, --outprefix**            Prefix of each output. If not defined, it will be calculated automatically.
*  **-c, --cpproj**               Flag for extracting CPProjInit. Default: **true**.
*  **-x, --extracomp**            Flag for extracting ExtraComponents. Default: **false**.
## soundfix options
*  *-u, --ulpath*          Unit loader source path. Usually, the path from unit loader to module should be "down-straight", which means no climb up other directory.
*  *-s, --src*             Initiator files and/or directories to find initiators. Only accept js file. All other types are ignored.