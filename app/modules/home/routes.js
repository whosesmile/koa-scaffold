var app = require('../../app');

// home
app.get('/', function* (next) {
  this.body = template.render('templates/home.html');
});