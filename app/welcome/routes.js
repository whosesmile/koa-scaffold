var path = require('path');
var app = require('../../app');
var template = require('../common/config').template;

// home
app.get('/', function * (next) {
  this.body = template.render('templates/welcome.html', {
    welcome: 'Hello, World'
  });
});