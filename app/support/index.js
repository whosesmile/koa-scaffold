var fs = require('fs');
var path = require('path');
var request = require('request');

// 递归遍历目录
var walk = exports.walk = function (dir, done) {
  var results = [];
  fs.readdir(dir, function (err, list) {
    if (err)
      return done(err);

    var pending = list.length;
    if (!pending)
      return done(null, results);

    list.forEach(function (file) {
      file = path.resolve(dir, file);
      fs.stat(file, function (err, stat) {
        if (stat && stat.isDirectory()) {
          walk(file, function (err, res) {
            results = results.concat(res);
            if (!--pending)
              done(null, results);
          });
        }
        else {
          results.push(file);
          if (!--pending)
            done(null, results);
        }
      });
    });
  });
};

// 返回当前的程序调用栈  
var callsite = exports.callsite = function () {
  var orig = Error.prepareStackTrace;
  Error.prepareStackTrace = function (_, stack) {
    return stack;
  };
  var err = new Error();
  Error.captureStackTrace(err, callsite);
  var stack = err.stack;
  Error.prepareStackTrace = orig;
  return stack;
};

// request proxy to return promise 
exports.request = function (options) {
  return new Promise(function (resolve, reject) {
    request(options, function (err, res) {
      if (err) {
        reject(err);
      }
      try {
        res = JSON.parse(res.body);
        res.code = parseInt(res.code, 10);
        if (res.code === 0 || res.code === 200) {
          resolve(res.data);
        }
        else {
          console.log(JSON.stringify(res))
          reject(res);
        }
      }
      catch (e) {
        reject({
          message: '服务器接口内部错误',
          status: 500
        });
      }
    });
  });
};

var response = exports.response = {

  // 参数不正确
  badRequest: function (message) {
    return {
      code: 400,
      data: {
        message: message || '请求参数不正确'
      }
    };
  }

};