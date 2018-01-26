/* jshint esversion: 6 */

/**
 * Custom log with tag preceding the phrase.
 * Take the first parameter as the tag.
 */
function tlog() {
	let args = Array.from(arguments),
		tag = args.shift();
	if (!tag) tag = 'CPExternalizer';
	console.log(tag + ' >>>>  '  + args.join(' '));
}


module.exports = tlog;