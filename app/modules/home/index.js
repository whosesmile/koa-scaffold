var Router = require('koa-router');
var router = module.exports = new Router();

// home
router.get('/', function*(next) {
  this.body = this.render('index.html');
});
