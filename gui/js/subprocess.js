// Redirect console.log and console.error
let log = '[log]', err = '[err]';
let _log = console.log;
console.log = function () {
    let str = Array.from(arguments).join(' ');
    _log(str);
    process.send(log + str);
}
let _error = console.error;
console.error = function () {
    let str = Array.from(arguments).join(' ');
    _error(str);
    process.send(err + str);
}
const Promise = require('bluebird');
let api = require(process.cwd() + '/api');

process.on('message', (msg) => {
    let args = msg.args;
    switch (msg.command) {
        case 'dirextract':
            api.dirextract(args.src, args.outdir)
                .then(() => {
                    process.send(log + 'Done!');
                    process.send(true);
                })
                .catch((error) => {
                    process.send(err + error);
                    process.send(false);
                });
            break;
        case 'soundfix':
            api.soundfix(args.src, args.ulpath)
                .then(() => {
                    process.send(log + 'Done!');
                    process.send(true);
                })
                .catch((error) => {
                    process.send(err + error);
                    process.send(false);
                });
            break;
        case 'xcpextract':
            api.xcpextract(args.src, args.outdir)
                .then(() => {
                    process.send(log + 'Done!');
                    process.send(true);
                })
                .catch((error) => {
                    process.send(err + error);
                    process.send(false);
                });
            break;
        case 'extract':
            api.extract(args.src, args.outdir)
                .then(() => {
                    process.send(log + 'Done!');
                    process.send(true);
                })
                .catch((error) => {
                    process.send(err + error);
                    process.send(false);
                });
            break;
        default:
            process.send('Unknown command');
            process.send(false);
            break;
    }
});