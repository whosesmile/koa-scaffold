var app = require('../../app');
var config = require('../../config');
var service = require('./service');
var fs = require('fs');

// http favicon
app.get('/favicon.ico', function * (next) {
  this.set('Cache-Control', 'public, max-age=' + 7 * 60 * 60);
  this.type = 'image/x-icon';
  this.body = yield service.readFile(config.favicon);
});

// json 上传图片
app.post('/common/upload', function * (next) {
  try {
    var list = [];

    for (var name in this.request.body.files) {
      if (this.request.body.files.hasOwnProperty(name)) {
        var files = this.request.body.files[name];
        files = files.constructor === Array ? files : [files];
        for (var i = 0; i < files.length; i++) {
          var file = files[i];
          if (file.size) {
            var path = yield config.storage.uploadImage(file.name, file.type, file.path);
            list.push({
              name: name,
              path: path
            });
          }

          // 移除本地缓存文件
          fs.unlink(file.path);
        }
      }
    }

    this.body = this.template.render(200, {
      list: list
    });
  }
  catch (e) {
    this.body = this.template.render(400, e);
  }
});