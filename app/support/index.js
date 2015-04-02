var fs = require('fs');
var path = require('path');
var request = require('request');
var _ = require('lodash');

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

/**
 * Converts an object to x-www-form-urlencoded serialization.
 * @param {Object} obj
 * @return {String}
 */
var serialize = exports.serialize = function (obj) {
  var query = '';
  var name, value, fullSubName, subName, subValue, innerObj, i;

  for (name in obj) {
    if (obj.hasOwnProperty(name)) {
      value = obj[name];

      if (value instanceof Array) {
        for (i = 0; i < value.length; ++i) {
          subValue = value[i];
          fullSubName = name + '[' + i + ']';
          innerObj = {};
          innerObj[fullSubName] = subValue;
          query += serialize(innerObj) + '&';
        }
      }
      else if (value instanceof Object) {
        for (subName in value) {
          if (value.hasOwnProperty(subName)) {
            subValue = value[subName];
            fullSubName = name + '.' + subName;
            innerObj = {};
            innerObj[fullSubName] = subValue;
            query += serialize(innerObj) + '&';
          }
        }
      }
      else if (value !== undefined && value !== null) {
        query += encodeURIComponent(name) + '=' + encodeURIComponent(value) + '&';
      }
    }
  }

  return query.length ? query.substr(0, query.length - 1) : query;
};

// 将服务器端返回的数据结构重新封装统一的格式
// {code:200, data: {message: 'some message'}}
function rebuild(res) {
  res = JSON.parse(res.body);
  if (_.isUndefined(res.code)) {
    return {
      code: 200,
      data: res
    };
  }
  res.code = parseInt(res.code, 10);
  res.code = res.code || 200;
  res.data = res.data2 || res.data || {}; // 奇葩的接口 绑定优惠券
  if (_.isArray(res.data)) {
    res.data = {
      list: res.data
    };
  }
  if (_.isPlainObject(res.data)) {
    res.data.message = res.msg || res.message || res.data.msg || res.data.message;
  }

  delete res.msg;
  delete res.message;
  delete res.data.msg;

  // 防止数据结构异常
  _.forIn(res, function (val, key) {
    if (key !== 'code' && key !== 'data') {
      res.data[key] = val;
      delete res[key];
    }
  });
  return res;
}

// request proxy to return promise 
exports.request = function (options, unpack) {
  return new Promise(function (resolve, reject) {

    console.info('\n**********');
    var st = new Date();
    console.info('request', options);
    request(options, function (err, res) {

      if (err) {
        console.log('error:', err);
        console.info('**********\n');
        return reject(err);
      }
      // 打印数据
      console.info('response:', res.body);
      console.info('spend time:', (new Date().getTime() - st.getTime()) / 1000, 's');
      console.info('**********\n');

      try {
        res = rebuild(res);

        // 默认自动拆包解析结果
        if (unpack !== false) {
          if (res.code === 200) {
            resolve(res.data);
          }
          else {
            reject(res.data);
          }
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

// 将数据中的空数据或未定义数据清除
exports.clean = function (data) {
  _.forIn(data, function (val, key) {
    if (_.isEmpty(val) || _.isUndefined(val)) {
      delete data[key];
    }
  });
  return data;
};

// 发送邮件
exports.sendMail = require('./mail').sendMail;