var fs = require('fs');
var Promise = require("bluebird");
var app = require('../../app');
var config = require('../../config');
var readFile = Promise.promisify(fs.readFile);

// favicon.ico
app.get('/favicon.ico', function* (next) {
  // 缓存7天
  this.set('Cache-Control', 'public, max-age=' + 7 * 60 * 60);
  this.type = 'image/x-icon';
  this.body =
    yield readFile(config.favicon);
});

// proxy error handler: 404 or 50X
var exceptionHandler = function () {
  var code = this.status;
  var page = code === 404 ? 'templates/404.html' : 'templates/500.html';
  var message = code === 404 ? 'page not found' : 'internal error';
  var mime = this.accepts(['json', 'html', 'text/plain']);
  this.status = 200;

  if (mime === 'json') {
    this.body = template.render(code, {
      message: message
    });
  }
  else if (mime === 'html') {
    this.body = template.render(page);
  }
  else {
    this.type = 'text';
    this.body = message;
  }
};

// error handler
app.use(function* (next) {
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
    if (error || 404 === this.status) {
      exceptionHandler.call(this);
    }
  }
});