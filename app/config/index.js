var fs = require('fs');
var path = require('path');
var conf = {};

try {
  conf = require('../../config');
} catch (e) {
  console.log('使用生产环境');
}

module.exports = {
  // port
  port: 9002,

  // view folder
  views: 'templates',

  // watch tempalte change
  watch: conf.watch || false,

  // favicon
  favicon: path.resolve(__dirname, '../favicon.ico'),

  // assets file
  assets: conf.assets || path.join(__dirname, '../../assets'),

  // assets target
  target: 'dist',

  // log file
  logger: {
    level: 'error',
    file: '/var/log/node/error.log',
  },
};
