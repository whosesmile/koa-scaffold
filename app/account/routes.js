var app = require('../app');

// account
app.get('/account', function * (next) {
  this.redirect('/account/profile');
});

// profile
app.get('/account/profile', function * (next) {
  this.body = template.render('templates/profile.html');
});

// register
app.get('/account/register', function * (next) {
  this.body = 'register page';
});

// login
app.get('/account/login', function * (next) {
  this.body = 'login page';
});

// logout
app.get('/account/logout', function * (next) {
  this.body = 'login page';
});