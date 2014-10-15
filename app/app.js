var koa = require('koa');
var path = require('path');
var swig = require('swig');
var router = require('koa-router');
var statics = require('koa-static-cache');
var compress = require('koa-compress');
var minifier = require('koa-html-minifier');
var favicon = require('koa-favicon');
var support = require('./support');

// Let's GO~
var app = module.exports = koa();

// config swig loader folder (config is useless unless you use swig not template)
swig.setDefaults({
  loader: swig.loaders.fs(path.resolve(__dirname)),
  cache: false // disabled for dev, should be commented on product
});

// shortcut for render file by relative path
global.template = {

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

// Initial router
app.use(router(app));

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

// config static 
app.use(statics('static/src', {
  gzip: true,
  prefix: '/static',
  maxAge: 365 * 24 * 60 * 60
}));

// config favicon.ico
app.use(favicon(path.join(__dirname, 'favicon.ico')));

// common routes.js
require('./modules/common/routes');

// load all routes.js
support.walk(__dirname, function (error, result) {
  if (error)
    console.error(error);

  result.filter(function (path) {
    return /routes\.js$/.test([path]);
  }).forEach(function (routes) {
    require(routes.replace(__dirname, '.'));
  });
});

var port = 7777;
app.listen(port);

console.log('Server started, listening on port:', port);
process.stdout.write('waiting...');