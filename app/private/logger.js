'use strict'

require('dotenv').config();
const path = require('path')

const winston = require('winston');

const get_debug_info = () => {
    var stack = new Error().stack,
        caller = stack.split('\n')[3].trim();

    return caller;
}

const format_level = (lvl) => {
    if (lvl == 'verbose')
        lvl = 'verb'
    return lvl
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
        logger._debug = (msg) => { logger.debug(msg + '\n>>>\t' + get_debug_info()) }
        logger._info = (msg) => { logger.info(msg + '\n>>>\t' + get_debug_info()) }
        logger._error = (msg) => { logger.error(msg + '\n>>>\t' + get_debug_info()) }
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