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

  // 添加优惠券过滤器
  swig.setFilter('coupon', function (input) {
    // 1:未使用 2,已使用 3：已过期 4：已作废 5：未生效 6：已锁定
    return [null, '未使用', '已使用', '已过期', '已作废', '未生效', '已锁定'][Number(input)] || '已禁用';
  });

  // 登录中间件 方便做登录验证跳转
  global.loginRequired = function * (next) {
    if (this.session.user) {
      yield next;
    }
    else {
      this.redirect('/login?next=' + encodeURIComponent(this.request.href));
    }
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
  app.keys = ['LWXA@0ZrXj~!]/mNHH98j/3yX R,?RT'];
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
    multipart: true,
    formidable: {
      uploadDir: path.join(__dirname, '../../upload')
    }
  }));

  // 读取project信息
  app.use(function * (next) {
    // 防止循环重定向
    if (!/^\/location(\/|$)/.test(this.path) && !this.session.projectId) {
      return this.redirect('/location');
    }

    // 是否是Ajax
    this.request.isAjax = this.headers['x-requested-with'] === 'XMLHttpRequest';
    yield next;
  });

  // 设置模板
  app.use(function * (next) {
    this.template = {
      render: function (template) {
        // 合并数据模型 
        var data = {};
        for (var i = 1; i < arguments.length; i++) {
          if (_.isObject(arguments[i])) {
            _.merge(data, arguments[i]);
          }
        }
        // 确定回调函数
        var callback = arguments[arguments.length - 1];
        callback = _.isFunction(callback) ? callback : null;

        // 兼容JSON响应
        if (_.isNumber(template)) {
          return this.renderJSON.apply(this, _.toArray(arguments));
        }

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
        if (_.isUndefined(data)) {
          data = {};
        }
        if (_.isString(data)) {
          data = {
            message: data
          };
        }
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