const Promise = require('bluebird');
let api = require(process.cwd() + '/api');

process.on('message', (msg) => {
    let args = msg.args;
    switch (msg.command) {
        case 'extract':
            api.extract(args.src, args.outdir)
                .then(() => {
                    process.send('done');
                })
                .catch((error) => {
                    process.send(error);
                });
            break;

        default:
            process.send('Unknown command');
            break;
    }
});