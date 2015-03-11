var config = require('./config');
var cluster = require('cluster');
var cpus = require('os').cpus().length;
var router = require('koa-router');
var support = require('./support');

var app = module.exports = config.init();

// 初始化routers
app.use(router(app));

// 遍历目录加载路由模块
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