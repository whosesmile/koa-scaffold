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

// compress html & text
app.use(compress({
  threshold: 1024,
  flush: require('zlib').Z_SYNC_FLUSH
}));

// html minifier
app.use(minifier({
  minifyJS: true,
  minifyCSS: true,
  collapseWhitespace: true,
  keepClosingSlash: true
}));

// config static 
app.use(statics('static/src', {
  prefix: '/static',
  gzip: true,
  maxAge: 365 * 24 * 60 * 60 // s
}));

// config favicon.ico
app.use(favicon(path.join(__dirname, 'favicon.ico'), {
  maxAge: 365 * 24 * 60 * 60 * 1000 // ms
}));

// Like python flask, add slash at end of path, hmm, just for beauty...
var slash = /\/$/;
app.use(function * (next) {
  if (this.accepts('text/html') && !slash.test(this.path)) {
    return this.redirect(this.path + '/');
  }
  yield next;
});

/*--------------------------------------------------------------------------------*/
// Add generator before this line, because router not call next generator continue.
/*--------------------------------------------------------------------------------*/

// init router
app.use(router(app));

// common routes.js
require('./modules/common/routes');

// load all routes.js
support.walk(__dirname, function (error, result) {
  if (error) {
    console.error(error);
  }

  result.filter(function (path) {
    return /\broutes\.js$/.test([path]);
  }).forEach(function (routes) {
    require(routes.replace(__dirname, '.'));
  });
});

var port = 7777;
app.listen(port, function () {
  console.log('Server started, listening on port: %d', port);
  process.stdout.write('waiting...');
});