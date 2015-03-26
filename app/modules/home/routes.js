var app = require('../../app');

app.redirect('/', '/home');

// http 网站首页
app.get('/home', function * (next) {
  this.body = this.template.render('templates/home.html');
});