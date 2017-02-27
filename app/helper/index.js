var fs = require('fs');
var path = require('path');

// 递归遍历目录
var walk = exports.walk = function(dir, deep) {
  var list = fs.readdirSync(dir);
  var pending = list.length;

  var results = [];
  list.filter(function(file) {
    // 不包含隐藏文件
    return !file.startsWith('.');
  }).forEach(function(file) {
    file = path.resolve(dir, file);
    var stat = fs.statSync(file);
    if (deep && stat && stat.isDirectory()) {
      results = results.concat(walk(file));
    } else {
      results.push(file);
    }
  });
  return results;
};

// 返回当前的程序调用栈
var callsite = exports.callsite = function() {
  var orig = Error.prepareStackTrace;
  Error.prepareStackTrace = function(_, stack) {
    return stack;
  };
  var err = new Error();
  Error.captureStackTrace(err, callsite);
  var stack = err.stack;
  Error.prepareStackTrace = orig;
  return stack;
};

// 禁用缓存拦截器
global.cacheDisabled = function*(next) {
  this.set('Cache-Control', 'no-cache, no-store, must-revalidate');
  this.set('Pragma', 'no-cache');
  this.set('Expires', 0);
  yield next;
};
