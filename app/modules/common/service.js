var fs = require('fs');

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