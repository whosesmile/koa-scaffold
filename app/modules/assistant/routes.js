var app = require('../../app');
var support = require('../../support');
var service = require('./service');
var _ = require('lodash');

// http 管家首页
app.get('/assistant', function * (next) {
  this.body = this.template.render('templates/assistant.html', {
    project: this.session.project
  });
});