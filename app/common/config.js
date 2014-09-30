var path = require('path');
var swig = require('swig');
var staticCache = require('koa-static-cache');
var app = require('../../app');
var support = require('./support');

app.use(function * (next) {
  console.log(this.path);
  yield next;
  console.log(this.path);
});

// config static 
app.use(staticCache('static/src', {
  maxAge: 365 * 24 * 60 * 60,
  prefix: '/static',
  gzip: true
}));

// config swig root folder
swig.setDefaults({
  loader: swig.loaders.fs(path.resolve(__dirname, '..'))
});

// shortcut for render file by relative path
var template = {

  regexp: /^[a-z]/i,

  render: function () {
    if (this.regexp.test(arguments[0])) {
      var stack = support.callsite();
      var folder = path.dirname(stack[1].getFileName());
      return swig.renderFile.apply(swig, [path.resolve(folder, arguments[0])].concat(Array.prototype.slice.call(arguments, 1)));
    }

    return swig.renderFile.apply(swig, Array.prototype.slice.call(arguments, 0));
  }

};

module.exports.swig = swig;
module.exports.template = template;