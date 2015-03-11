var app = require('../../app');

// http 网站首页
app.get('/', function * (next) {
  this.body = this.template.render('templates/home.html');
});