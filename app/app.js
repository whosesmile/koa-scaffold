var koa = require('koa');
var path = require('path');
var swig = require('swig');
var router = require('koa-router');
var minifier = require('koa-html-minifier');
var session = require('koa-session');
var parseForm = require('koa-body');
var _ = require('lodash');
var cpus = require('os').cpus().length;
var config = require('./config');
var support = require('./support');
var cluster = require('cluster');

// 配置模板加载路径
swig.setDefaults({
  loader: swig.loaders.fs(path.resolve(__dirname)),
  cache: config.templateCache // disabled for dev, should be commented on product
});

// 添加全局模板引用 方便渲染页面
global.template = {

  // 用来渲染页面
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

    // HTML模板中使用的静态域名
    data.shost = config.shost; // static host
    data.whost = config.whost; // webapi host

    // 根据相对位置查找模板
    if (/^[^./]/i.test(template)) {
      var folder = path.dirname(support.callsite()[1].getFileName());
      template = path.resolve(folder, template);
    }

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

// 登录中间件 方便做登录验证跳转
global.loginRequired = function * (next) {
  if (this.session.user) {
    yield next;
  }
  else {
    this.redirect('/login?next=' + encodeURIComponent(this.request.href));
  }
};

// 初始化
var app = module.exports = koa();

// 设置session
app.keys = ['LWXA@0ZrXj~!]/mNHH98j/3yX R,?RT'];
app.use(session(app, {
  key: 'T',
  maxage: 365 * 24 * 60 * 60 * 1000
}));

// 去除HTML页面中的换行和空白
app.use(minifier({
  minifyJS: true,
  minifyCSS: true,
  collapseWhitespace: true,
  keepClosingSlash: true,
  removeComments: true
}));

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
        this.body = template.render(this.status, this.status === 404 ? '文件未找到' : '服务器异常');
      }
      else if (mime === 'html') {
        this.body = template.render(this.status === 404 ? 'modules/common/templates/404.html' : 'modules/common/templates/500.html');
      }
      else {
        this.type = 'text';
        this.body = this.status;
      }
    }
  }
});

// 解析form
app.use(parseForm());

// 读取project信息
app.use(function * (next) {
  // 防止循环重定向
  if (!/^\/location(\/|$)/.test(this.path) && !this.session.projectId) {
    return this.redirect('/location');
  }
  yield next;
});

/*--------------------------------------------------------------------------------*/
// Add generator before this line, because router not call next generator continue.
/*--------------------------------------------------------------------------------*/

// 初始化routers
app.use(router(app));

// 加载通用路由模块
require('./modules/common/routes');

// 遍历目录加载所有模块
support.walk(__dirname, function (error, result) {
  result.filter(function (path) {
    return /\broutes\.js$/.test([path]);
  }).forEach(function (routes) {
    require(routes.replace(__dirname, '.'));
  });
});

// 启动服务器
if (cluster.isMaster) {
  for (var i = 0; i < cpus; i++) {
    cluster.fork();
  }
}
else {
  app.listen(config.port, function () {
    console.log('clustor worker %d started, listening on port: %d', cluster.worker.id, config.port);
  });
}