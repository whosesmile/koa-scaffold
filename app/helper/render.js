var _ = require('lodash');
var path = require('path');
var helper = require('.');
var config = require('../config');

// 模板方法
module.exports = function(ctx, env) {
  return function(name) {
    var data = {};

    // JSON
    if (_.isNumber(name)) {

      // MESSAGE
      if (!_.isObject(arguments[1])) {
        data.message = arguments[1];
      }
      // MULTI DATA
      else {
        _.extend.apply(_, [data].concat(Array.prototype.slice.call(arguments, 1)));
      }

      return {
        code: name,
        data: data,
      };
    }

    // 上下文变量
    _.extend(data, ctx.state);

    // HTML
    var module = path.dirname(helper.callsite()[1].getFileName());
    var abspath = path.resolve(module, name);
    // if it's nether the relative or absolute path nor config view folder, should find the right template folder
    if (!name.startsWith('.') && !name.startsWith('/') && !name.startsWith(config.views)) {
      abspath = path.resolve(module, config.views, name);
    }

    _.extend.apply(_, [data].concat(Array.prototype.slice.call(arguments, 1)));
    return env.render(abspath, data);
  };
};
