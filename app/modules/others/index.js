var fs = require('fs');
var Router = require('koa-router');
var logger = require('../../helper/logger');
var storage = require('../../helper/storage');
var router = module.exports = new Router();

// 上传
router.post('/upload', function*(next) {
  try {
    var list = [];
    var files = this.request.body.files;
    for (var name in files) {
      if (files.hasOwnProperty(name)) {
        var group = files[name];
        group = group.constructor === Array ? group : [group];
        for (var i = 0; i < group.length; i++) {
          var file = group[i];
          try {
            if (file.size) {
              var path = yield storage.upload(file.name, file.path);
              list.push(path);
            }
          }
          // 移除本地缓存文件
          finally {
            fs.unlink(file.path);
          }
        }
      }
    }

    this.body = this.render(200, {
      list: list
    });
  } catch (e) {
    logger.error(e);
    this.body = this.render(400, e);
  }
});
