var app = require('../../app');
var config = require('../../config');
var service = require('./service');
var parse = require('co-busboy');
var fs = require('fs');
var path = require('path');

// http favicon
app.get('/favicon.ico', function * (next) {
  this.set('Cache-Control', 'public, max-age=' + 7 * 60 * 60);
  this.type = 'image/x-icon';
  this.body = yield service.readFile(config.favicon);
});

// 上传图片
app.post('/common/upload', function * (next) {
  var part;
  var parts = parse(this);
  while (part = yield parts) {
    var stream = fs.createWriteStream(path.join(config.upload, Math.random().toString()));
    part.pipe(stream);
    console.log('uploading %s -> %s', part.filename, stream.path);
  }

  this.redirect('/');
});