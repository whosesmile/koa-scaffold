var fs = require('fs');
var path = require('path');
var request = require('request');

// recursive dir
function walk(dir, done) {
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
}

// caller stack
function callsite() {
  var orig = Error.prepareStackTrace;
  Error.prepareStackTrace = function (_, stack) {
    return stack;
  };
  var err = new Error();
  Error.captureStackTrace(err, callsite);
  var stack = err.stack;
  Error.prepareStackTrace = orig;
  return stack;
}

// request proxy to return promise 
function requestProxy(options) {
  return new Promise(function (resolve, reject) {
    request(options, function (err, res) {
      if (err) {
        reject(err);
      }
      res = JSON.parse(res.body);
      res.code = parseInt(res.code, 10);
      resolve(res);
    });
  });
}

var response = {

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

module.exports.walk = walk;
module.exports.callsite = callsite;
module.exports.request = requestProxy;
module.exports.response = response;