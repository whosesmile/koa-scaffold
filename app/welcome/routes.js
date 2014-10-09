var app = require('../../app');
var template = require('../common/config').template;

// home
app.get('/', function * (next) {
  this.body = template.render('templates/welcome.html', {
    welcome: 'Reload Test'
  });
});

// error
app.get('/error', function * (next) {
  this.body = global.a;
});