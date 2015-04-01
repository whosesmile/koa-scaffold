var app = require('../../app');
var service = require('./service');

app.redirect('/', '/home');

// http 网站首页
app.get('/home', function * (next) {
  var data = yield service.home(this.session.project.id);
  this.body = this.template.render('templates/home.html', data);
});