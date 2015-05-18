var app = require('../../app');
var support = require('../../support');
var service = require('./service');
var _ = require('lodash');

app.redirect('/login', '/account/login');
app.redirect('/logout', '/account/logout');
app.redirect('/register', '/account/register');

// http 个人主页
app.get('/profile', function * (next) {
  this.body = this.template.render('templates/profile.html', {
    user: this.session.user
  });
});