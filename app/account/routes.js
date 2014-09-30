var app = require('../../app');
var template = require('../common/config').template;

// account
app.get('/account', function * (next) {
  this.redirect('/account/profile');
});

// profile
app.get('/account/profile', function * (next) {
  this.body = template.render('templates/profile.html');
});

// params test
app.get('/profile/:name/:age', function * (next) {
  this.body = 'profile home';
});