var argv = require('minimist')(process.argv.slice(2), {
    default: {
        port: 8082,
        server: 'localhost',
    },
    alias: {
        port: 'p',
        server: 's',
    },
});

module.exports = {
    // Expose the raw CLI args and options
    ARGUMENTS: argv['_'],
    OPTIONS: argv,

    SERVER: argv.server,
    PORT: argv.port,

    MSG_ID: 'msg_id',
    MSG_EVENT: 'msg_event'
};
