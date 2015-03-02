var app = require('../../app');
var support = require('../../support');
var service = require('../common/service');
var _ = require('lodash');

// 选择城市
app.get('/location/city', function * (next) {
  var data = yield service.listCity();
  this.body = template.render('templates/city.html', data);
});

// 选择项目
app.get('/location/project', function * (next) {
  var data = yield service.listProject(this.request.query.cityId);
  this.body = template.render('templates/project.html', data);
});