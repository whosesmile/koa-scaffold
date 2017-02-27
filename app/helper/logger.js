var winston = require('winston');
var moment = require('moment');
var config = require('../config');

// 日志系统
module.exports = new(winston.Logger)({
  transports: [
    new(winston.transports.Console)({
      level: 'debug',
      colorize: true
    }),
    new(winston.transports.File)({
      name: 'app',
      filename: config.logger.file,
      level: config.logger.level,
      maxsize: 1024 * 1024 * 100, // 100MB
      maxFiles: 1,
      tailable: true, // loop write
      timestamp: function() {
        // timezone
        return moment().format('YYYY-MM-DD HH:mm:ss.SSS Z');
      }
    }),
  ]
});
