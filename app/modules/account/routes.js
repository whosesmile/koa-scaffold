var app = require('../../app');
var response = require('../../support');
var service = require('./service');
var _ = require('lodash');

// profile
app.get('/profile', function * (next) {
  this.body = template.render('templates/profile.html');
});

// register
app.get('/register', function * (next) {
  this.body = 'register page';
});

// login
app.get('/login', function * (next) {
  this.body = template.render('templates/login.html');
});

// logout
app.get('/logout', function * (next) {
  this.body = 'login page';
});

// mobile exists
app.get('/account/exists', function * (next) {
  var mobile = this.request.query.mobile;
  if (_.isUndefined(mobile)) {
    this.body = response.badRequest('请输入手机号码');
  }
  else {
    this.body = yield service.exists(mobile);
  }
});