var app = require('../../app');

// home
app.get('/', function * (next) {
  // this.redirect('/shopping');
  this.body = template.render('templates/home.html');
});