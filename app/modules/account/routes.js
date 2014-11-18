var app = require('../../app');

// account
app.get('/account/', function * (next) {
  this.redirect('/account/profile');
});

// login
app.get('/login/', function * (next) {
  this.redirect('/account/login');
});

// logout
app.get('/logout/', function * (next) {
  this.redirect('/account/logout');
});

// profile
app.get('/account/profile/', function * (next) {
  this.body = template.render('templates/profile.html');
});

// register
app.get('/account/register/', function * (next) {
  this.body = 'register page';
});

// login
app.get('/account/login/', function * (next) {
  this.body = template.render('templates/login.html');
});

// logout
app.get('/account/logout/', function * (next) {
  this.body = 'login page';
});