var appRoot = require('app-root-path');
var winston = require('winston');

var options = {
file: {
    level: 'info',
    filename: `${appRoot}/logs/csye6225.log`,
    handleExceptions: true,
    json: true,
    maxsize: 5242880, // 5MB
    maxFiles: 5,
    colorize: false,
},
console: {
    level: 'debug',
    handleExceptions: true,
    json: false,
    colorize: true,
},
};

var log = new winston.createLogger({
transports: [
    new winston.transports.File(options.file),
    new winston.transports.Console(options.console)
],
exitOnError: false,
});

log.stream = {
write: function(message, encoding) {
    log.info(message);
},
};

module.exports = log;