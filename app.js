var koa = require('koa');
var router = require('koa-router');
var support = require('./app/common/support');
var debug = require('debug')('koa:scaffold');
var app = module.exports = koa();
var port = 7777;

var config = require('./app/common/config');

// 初始化路由
app.use(router(app));

// 加载路由模块
// 根据约定, 路由文件名称应该定义为: routes.js
support.walk(__dirname, function (error, result) {
  if (error)
    console.error(error);

  result.filter(function (path) {
    return /routes\.js$/.test([path]);
  }).forEach(function (routes) {
    require(routes.replace(__dirname, '.'));
  });
});

app.listen(port);

console.log('Server started, listening on port:', port);
process.stdout.write('waiting...');