require('dotenv').config();
const path = require('path')

const winston = require('winston');

const logger = (filename) => {
    filename = path.basename(filename).split('.')[0]
    return winston.createLogger({
        level: process.env.LOG_LEVEL || 'info',
        format: winston.format.combine(
            winston.format.timestamp({
                format: `DD-MMM-YYYY HH:mm:ss.SSS`
            }),
            winston.format.printf(
                info => `${info.level}:\t[ ${[info.timestamp]} ][${filename}]: ${info.message}`),
        ),

        transports: [
            new winston.transports.File({ level: process.env.LOG_LEVEL || 'info', filename: 'logs/summary.log' }),
            new winston.transports.File({ level: 'error', filename: 'logs/error.log' }),
            // new winston.transports.File({ level: 'verbose', filename: 'logs/verbose.log' }),
            new winston.transports.Console()
        ],
    });
}


module.exports = logger;