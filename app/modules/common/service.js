var fs = require('fs');
var request = require('../../support').request;

/**
 * 读取文件
 * @param  {string} path 文件路径
 * @return promise
 */
exports.readFile = function (path) {
  return new Promise(function (resolve, reject) {
    fs.readFile(path, function (err, data) {
      resolve(data);
    });
  });
};

// 通用代理
exports.proxyRequest = function (options) {
  return request(options, false);
};