var path = require('path');
var swig = require('swig');
var compress = require('koa-compress');
var minifier = require('koa-html-minifier');
var staticCache = require('koa-static-cache');
var app = require('../../app');
var support = require('./support');

// config swig root folder
swig.setDefaults({
  loader: swig.loaders.fs(path.resolve(__dirname, '..')),
  cache: false // disabled for dev, should be enabled on product
});

// shortcut for render file by relative path
var template = {

  regexp: /^[^./]/i,

  render: function () {
    if (this.regexp.test(arguments[0])) {
      var stack = support.callsite();
      var folder = path.dirname(stack[1].getFileName());
      return swig.renderFile.apply(swig, [path.resolve(folder, arguments[0])].concat(Array.prototype.slice.call(arguments, 1)));
    }

    return swig.renderFile.apply(swig, Array.prototype.slice.call(arguments, 0));
  },

  stringify: function (data, code) {
    return {
      code: code || 200,
      data: data
    };
  }

};

// parse request header
app.use(function * (next) {
  this.mime = this.accepts(['json', 'html', 'text/plain']);
  yield next;
});

// error handler: 404 or 50X
var exceptionHandler = function () {
  var code = this.status;
  var page = code === 404 ? '404.html' : '500.html';
  var message = code === 404 ? 'page not found' : 'internal error';

  this.status = 200;

  if (this.mime === 'json') {
    this.body = template.stringify({
      message: message
    }, code);
  }
  else if (this.mime === 'html') {
    this.body = template.render(page);
  }
  else {
    this.type = 'text';
    this.body = message;
  }
};

// 500 handler
app.use(function * (next) {
  try {
    yield next;
  }
  catch (err) {
    console.log(err);
    this.status = err.status || 500;
    exceptionHandler.call(this);
  }
});

// 404 handler
app.use(function * pageNotFound(next) {
  yield next;

  if (404 === this.status) {
    exceptionHandler.call(this);
  }
});

// config static 
app.use(staticCache('static', {
  gzip: true,
  prefix: '/static',
  maxAge: 365 * 24 * 60 * 60
}));

// compress html
app.use(compress({
  threshold: 1024,
  flush: require('zlib').Z_SYNC_FLUSH,
  filter: function (content_type) {
    return /text/i.test(content_type);
  }
}));

// html minifier
app.use(minifier({
  collapseWhitespace: true,
  minifyJS: true,
  minifyCSS: true,
  keepClosingSlash: true
}));

module.exports.swig = swig;
module.exports.template = template;