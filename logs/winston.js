'use strict';
const winston = require('winston');
const path = require('path');
const rootPath = require('forthright48/world').rootPath;

winston.emitErrs = true;

const logger = new winston.Logger({
  transports: [
    new winston.transports.File({
      level: 'info',
      filename: path.join(rootPath, './logs/all-logs.log'),
      handleExceptions: true,
      json: true,
      maxsize: 5242880, //5MB
      maxFiles: 5,
      colorize: false
    }),
    new winston.transports.Console({
      level: 'debug',
      handleExceptions: true,
      json: false,
      colorize: true
    })
  ],
  exitOnError: false
});

module.exports = logger;
module.exports.stream = {
  write(message) {
    logger.info(message);
  }
};
