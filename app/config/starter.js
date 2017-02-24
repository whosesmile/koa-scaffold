var koa = require('koa');
var path = require('path');
var swig = require('swig');
var minifier = require('koa-html-minifier');
var session = require('koa-session');
var flash = require('koa-flash');
var koaBody = require('koa-body');
var _ = require('lodash');
var support = require('../support');

module.exports = function (templateCache, shost, whost) {

  // 配置模板加载路径
  swig.setDefaults({
    loader: swig.loaders.fs(path.join(__dirname, '..')),
    cache: templateCache // disabled for dev, should be commented on product
  });

  // 东八区
  swig.setDefaultTZOffset(-480);

  // 登录中间件 方便做登录验证跳转
  global.loginRequired = function * (next) {
    if (this.session.user) {
      yield next;
    }
    else {
      if (this.request.isAjax) {
        this.body = this.template.render(403, '请先登录');
      }
      else if (this.request.method === 'GET') {
        this.redirect('/account/login?next=' + encodeURIComponent(this.request.url));
      }
      else {
        this.redirect('/account/login?next=' + encodeURIComponent(this.headers.referer || '/home'));
      }
    }
  };

  // 验证
  global.validator = function () {
    var rules = _.toArray(arguments).splice(0, arguments.length - 1);
    var handler = arguments[arguments.length - 1];
    return function * (next) {
      var errors = [];
      for (var i = 0; i < rules.length; i++) {
        var rule = rules[i].split(':');
        // 数字校验
        if (rule[0].toLowerCase() === 'number' && !/^\d+(.\d+)?$/.test(this.params[rule[1]])) {
          errors.push([rule[0], this.path, this.params[rule[1]]]);
        }
      }
      if (errors.length === 0) {
        yield handler;
      }
      else {
        yield next;
      }
    };
  };

  // 根据名称寻找router并运行
  global.findRouter = function (name) {
    return function * (next) {
      var route = app.router.route('notice');
      next = route.middleware.call(this, next);
      yield * next;
    };
  };

  var app = koa();

  // 全局错误处理
  app.use(function * (next) {
    var error = null;
    try {
      yield * next;
    }
    catch (e) {
      error = e;
      this.status = e.status || 500;
      console.log('\n>>>>>>>>>>>>>>>>>>');
      console.log(e);
    }
    finally {
      if (this.status === 404 || error) {
        var mime = this.accepts(['json', 'html', 'text/plain']);
        if (mime === 'json') {
          this.body = this.template.render(this.status, this.status === 404 ? '文件未找到' : '服务器异常');
        }
        else if (mime === 'html') {
          this.body = this.template.render(this.status === 404 ? '../app/modules/common/templates/404.html' : '../app/modules/common/templates/500.html');
        }
        else {
          this.type = 'text';
          this.body = this.status;
        }
      }
    }
  });

  // 设置session
  app.keys = ['somesecredkey'];
  app.use(session(app, {
    key: 'T',
    maxage: 365 * 24 * 60 * 60 * 1000 // 一年过期
  }));

  // 去除HTML页面中的换行和空白
  app.use(minifier({
    minifyJS: true,
    minifyCSS: true,
    collapseWhitespace: true,
    keepClosingSlash: true,
    removeComments: true
  }));

  // 解析form
  app.use(koaBody({
    strict: false,
    multipart: true,
    formidable: {
      uploadDir: path.join(__dirname, '../../upload')
    }
  }));

  app.use(function * (next) {
    // 是否是Ajax
    this.request.isAjax = this.headers['x-requested-with'] === 'XMLHttpRequest';
    yield next;
  });

  // 设置模板
  app.use(function * (next) {
    var context = this;

    this.template = {

      render: function (template) {

        // 合并数据模型 
        var data = {};
        if (arguments.length === 2 && _.isString(arguments[1])) {
          data.message = arguments[1];
        }
        else {
          for (var i = 1; i < arguments.length; i++) {
            if (_.isObject(arguments[i])) {
              _.merge(data, arguments[i]);
            }
          }
        }

        // 兼容JSON响应
        if (_.isNumber(template)) {
          return this.renderJSON(template, data);
        }

        // 确定回调函数
        var callback = arguments[arguments.length - 1];
        callback = _.isFunction(callback) ? callback : null;

        // 根据相对位置查找模板
        if (/^[^./]/i.test(template)) {
          var folder = path.dirname(support.callsite()[1].getFileName());
          template = path.resolve(folder, template);
        }

        // HTML模板中使用的静态域名
        data.shost = shost; // static host
        data.whost = whost; // webapi host
        data.flash = this.flash;

        return swig.renderFile(template, data, callback);
      },

      // 用来渲染JSON
      renderJSON: function (code, data) {
        return {
          code: code,
          data: data
        };
      }
    };

    yield next;
  });

  return app;
};
