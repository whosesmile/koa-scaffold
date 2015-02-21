var app = require('../../app');

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