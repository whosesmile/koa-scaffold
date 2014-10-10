var app = require('../app');

// proxy error handler: 404 or 50X
var exceptionHandler = function () {
  var code = this.status;
  var page = code === 404 ? 'templates/404.html' : 'templates/500.html';
  var message = code === 404 ? 'page not found' : 'internal error';
  var mime = this.accepts(['json', 'html', 'text/plain']);
  this.status = 200;

  if (mime === 'json') {
    this.body = template.stringify({
      message: message
    }, code);
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
app.use(function * (next) {
  var error = null;
  try {
    yield next;
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