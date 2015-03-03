var app = require('../../app');
var support = require('../../support');
var service = require('../common/service');
var _ = require('lodash');

// 列出城市
app.get('/location', function * (next) {
  var data = yield service.listCity();
  this.body = template.render('templates/city.html', data);
});

// 列出城市开通的项目
app.get('/location/:cityId', function * (next) {
  var data = yield service.listProject(this.params.cityId);
  this.body = template.render('templates/project.html', data);
});

// 选择项目
app.get('/location/choose/:projectId', function * (next) {
  this.session.projectId = this.params.projectId;
  this.redirect('/');
});