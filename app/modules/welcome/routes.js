var app = require('../../app');

// home
app.get('/', function * (next) {
  this.redirect('/account/login/');
});

// error
app.get('/error', function * (next) {
  this.body = '';
});