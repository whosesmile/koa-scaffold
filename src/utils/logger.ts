import path = require('path');
import moment = require('moment');
import winston = require('winston');
import 'winston-daily-rotate-file';

const logger = new (winston.Logger)({
  transports: [
    new (winston.transports.Console)({
      level: process.env.NODE_ENV === 'production' ? 'error' : 'debug',
      silent: process.env.NODE_ENV === 'test',
    }),
    new (winston.transports.DailyRotateFile)({
      filename: '%DATE%.log',
      dirname: path.resolve(process.env.LOG_DIR || './logs'), // 日志位置
      level: process.env.NODE_ENV === 'production' ? 'info' : 'debug',
      maxFiles: '7d', // 保留7天日志
      datePattern: 'YYYY-MM-DD', // 文件日期格式
      timestamp: () => moment().format('YYYY-MM-DD HH:mm:ss.SSS'),
    }),
  ],
});

if (process.env.NODE_ENV !== 'production') {
  logger.debug('Logger initialized at debug level');
}

export default logger;
