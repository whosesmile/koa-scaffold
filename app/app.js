var koa = require('koa');
var path = require('path');
var swig = require('swig');
var router = require('koa-router');
var minifier = require('koa-html-minifier');
var http = require('http');
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

  render: function (template, model, callback) {
    // 兼容JSON处理
    if (_.isNumber(template)) {
      return this.renderJSON(template, model);
    }

    // 添加静态域名变量
    model = _.merge({
      shost: config.shost
    }, model);

    if (/^[^./]/i.test(template)) {
      var folder = path.dirname(support.callsite()[1].getFileName());
      template = path.resolve(folder, template);
    }

    return swig.renderFile(template, model, callback);
  },

  renderJSON: function (code, data) {
    return JSON.stringify({
      code: code,
      data: data
    });
  }

};

// 初始化
var app = module.exports = koa();

// 去除HTML页面中的换行和空白
app.use(minifier({
  minifyJS: true,
  minifyCSS: true,
  collapseWhitespace: true,
  keepClosingSlash: true
}));

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