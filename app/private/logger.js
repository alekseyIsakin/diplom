'use strict'

require('dotenv').config();
const path = require('path')

const winston = require('winston');

const get_debug_info = () => {
    var stack = new Error().stack,
        caller = stack.split('\n')[4].trim();

    return caller;
}

const format_level = (lvl) => {
    if (lvl == 'verbose')
        lvl = 'verb'
    return lvl
}
const msg_debug_concat = (msg, quiet) => {
    if (!quiet)
        msg += '\n>>>\t' + get_debug_info()
    return msg
}

const logger = (filename) => {
    filename = path.basename(filename).split('.')[0]
    const logger = winston.createLogger({
        level: process.env.LOG_LEVEL || 'info',
        format: winston.format.combine(
            winston.format.timestamp({
                format: `DD-MMM-YYYY HH:mm:ss.SSS`
            }),
            winston.format.printf(
                info => `${format_level(info.level)}:\t[ ${[info.timestamp]} ][${filename}]: ${info.message}`),
        ),

        transports: [
            new winston.transports.File({ level: process.env.LOG_LEVEL || 'info', filename: 'logs/summary.log' }),
            new winston.transports.File({ level: 'error', filename: 'logs/error.log' }),
            new winston.transports.Console()
        ],
    });

    if (process.env.LOG_LEVEL.toUpperCase() == 'DEBUG') {
        logger._debug = (msg, quiet = false) => { logger.debug(msg_debug_concat(msg, quiet)) }
        logger._info = (msg, quiet = false) => { logger.info(msg_debug_concat(msg, quiet)) }
        logger._error = (msg, quiet = false) => { logger.error(msg_debug_concat(msg, quiet)) }
    }
    else {
        logger._debug = logger.debug
        logger._error = logger.error
        logger._info = logger.info
    }

    return logger
}
module.exports = logger;


// module.exports = debug_logger;