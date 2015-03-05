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
exports.request = function (options, unpack) {
  return new Promise(function (resolve, reject) {
    request(options, function (err, res) {
      if (err) {
        reject(err);
      }
      // 打印数据
      console.info('\n**********');
      console.info('request:', options)
      console.info('response:', res.body);
      console.info('**********\n');

      try {
        res = rebuild(res);

        // 默认自动拆包解析结果
        if (unpack !== false) {
          res.code === 200 ? resolve(res.data) : reject(res.data);
        }
        else {
          resolve(res);
        }
      }
      catch (e) {
        console.error(e);
        reject({
          message: '服务器接口内部错误',
          status: 500
        });
      }
    });
  });
};

// 将服务器端返回的数据结构重新封装统一的格式
// {code:200, data: {message: 'some message'}}
function rebuild(res) {
  res = JSON.parse(res.body);
  res.code = parseInt(res.code, 10);
  res.code = res.code || 200;
  res.data = res.data || {};
  res.data.message = res.msg || res.message || res.data.msg || res.data.message;
  delete res.msg;
  delete res.message;
  delete res.data.msg;
  return res;
}

// 响应快捷方式
exports.response = {

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