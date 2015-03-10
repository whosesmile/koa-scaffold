var app = require('../../app');
var config = require('../../config');
var service = require('./service');

// http 登录重定向
app.get('/account/login', function * (next) {
  return this.redirect('/login');
});

// http 登出重定向
app.get('/account/logout', function * (next) {
  return this.redirect('/logout');
});

// http favicon
app.get('/favicon.ico', function * (next) {
  this.set('Cache-Control', 'public, max-age=' + 7 * 60 * 60);
  this.type = 'image/x-icon';
  this.body = yield service.readFile(config.favicon);
});

// 上传图片
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
        }
      }
    }

    this.body = template.render(200, {
      list: list
    });
  }
  catch (e) {
    this.body = template.render(400, e);
  }
});