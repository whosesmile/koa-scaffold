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

  // 订单状态
  swig.setFilter('order', function (input) {
    // 1:已下单待付款 2:已退单 3:过期已取消 4:已付全款 5:全部签收 6:付款中 7:支付失败
    return [null, '待付款', '已退单', '已过期', '已付款', '已签收', '付款中', '支付失败', null, '部分到货', '全部到货', '部分签收', null, '部分退款', '全部退款', '现金部分退款', '现金全部退款'][Number(input)] || '已禁用';
  });

  // 添加性别过滤器
  swig.setFilter('sex', function (input) {
    return ['女士', '先生'][input] || '保密';
  });

  // 添加支付方式过滤器
  swig.setFilter('payment', function (input) {
    return {
      '11': '现金支付',
      '21': '刷卡支付',
      '31': '支付宝',
      '41': '微信支付'
    }[input] || '其他';
  });

  // 通知类型
  swig.setFilter('notice', function (input) {
    // 1:紧急通知 2:通知 3:社区活动
    return [null, '紧急通知', '通知', '社区活动'][Number(input)] || '';
  });

  // 添加小数点
  swig.setFilter('currency', function (input, size, symbol) {
    return _.isUndefined(input) ? '' : (symbol || '￥') + Number(input).toFixed(size || 2);
  });

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
    strict: false,
    multipart: true,
    formidable: {
      uploadDir: path.join(__dirname, '../../upload')
    }
  }));

  // 读取project信息
  app.use(function * (next) {
    var except = [/^\/location(\/|$)/, /^\/activity\//, /^\/mobile\//];

    // 是否允许项目为空
    var disallow = true;
    for (var i = 0; i < except.length; i++) {
      if (except[i].test(this.path)) {
        disallow = false;
        break;
      }
    }

    // 如果不允许
    if (disallow && !this.session.project) {
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