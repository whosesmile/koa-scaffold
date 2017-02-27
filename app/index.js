var _ = require('lodash');
var koa = require('koa');
var path = require('path');
var util = require('util');
var nunjucks = require('nunjucks');
var parser = require('koa-body');
var session = require('koa-session');
var send = require('koa-send');
var config = require('./config');
var helper = require('./helper');
var favicon = require('./helper/favicon');
var filter = require('./helper/filter');
var minify = require('./helper/minify');
var render = require('./helper/render');
var logger = require('./helper/logger');

// init koa
var app = module.exports = koa();

// handle favicon
app.use(favicon(config.favicon));

// assets files
app.use(function*(next) {
  if (this.path.startsWith('/assets/')) {
    // remove version suffix
    this.path = this.path.replace(/-\$[\d\w]+\$/i, '');
    // rewrite path to dist folder
    this.path = this.path.replace(/(\/assets)(\/[^/]+)(.+)/, util.format('$2/%s$3', config.target));
    return yield send(this, this.path, {
      root: config.assets,
      maxage: 365 * 24 * 60 * 60,
    });
  }
  yield next;
});

// config session based on cookie
app.keys = ['P@LW9XXA@O10ZrXj~!]/mNHH98j/3yX R,?RT'];
app.use(session(app));

// config nunjucks
var env = new nunjucks.Environment(new nunjucks.FileSystemLoader(['app'], {
  watch: config.watch,
}));

// add filter to env
filter(env);

// config nunjucks global varible
env.addGlobal('layout', '../../../views/layout.html');
env.addGlobal('macro', '../../../views/macro.html');

// elapsed time
app.use(function*(next) {
  var start = Date.now();
  yield next;
  var ms = Date.now() - start;
  this.set('X-Response-Time', ms + 'ms');
});

// add some state
app.use(function*(next) {
  var headers = this.headers || {};
  var userAgent = (headers['user-agent'] || '').toLowerCase();
  this.state.nested = userAgent.includes('micromessenger');
  this.state.isAjax = headers['x-requested-with'] === 'XMLHttpRequest';
  env.addGlobal('nested', this.state.nested);
  yield next;
});

// inject render method
app.use(function*(next) {
  this.render = render(this, env);
  yield next;
});

// error handler
app.use(function*(next) {
  try {
    yield next;
  } catch (e) {
    logger.error(this.status, this.url, this.method, this.headers);
  } finally {
    if (this.status !== 200) {
      // ajax
      if (this.accepts('html', 'json') === 'json') {
        this.body = this.render(this.status, '服务异常');
      }
      // html
      else {
        var code = [403, 404, 500].indexOf(this.status) !== -1 ? this.status : 500;
        this.body = this.render(util.format('./views/%s.html', code));
      }
    }
  }
});

// minify html
app.use(minify({
  minifyJS: {
    mangle: false,
  },
  minifyCSS: true,
  collapseWhitespace: true,
  keepClosingSlash: true,
  removeComments: true,
  processScripts: [],
}));

// parse form
app.use(parser({
  strict: false,
  jsonLimit: 1024 * 1024 * 2, // 2MB
  formLimit: 1024 * 1024 * 2, // 2MB
  textLimit: 1024 * 1024 * 2, // 2MB
  multipart: true,
  formidable: {
    uploadDir: path.join(__dirname, '../upload'),
  }
}));

// import modules
helper.walk(path.join(__dirname, 'modules')).forEach(function(path) {
  var router = require(path);
  if (typeof router.routes === 'function') {
    app.use(router.routes()).use(router.allowedMethods());
  }
});

app.listen(config.port, function() {
  logger.info('\nServer started on port:', config.port, '\n');
});
