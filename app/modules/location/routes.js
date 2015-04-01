var app = require('../../app');
var service = require('./service');

// ajax 定位城市
app.get('/location/geosearch', function * (next) {
  var data = yield service.geolocation(this.query.lat, this.query.lng);
  if (data.error) {
    return this.body = this.template.render(400, '获取地理信息失败');
  }

  var name = data.city.replace('市', '');
  var city = yield service.findCity(name);
  if (city) {
    return this.body = this.template.render(200, city);
  }
  return this.body = this.template.render(400, name + ' (暂时没有开放)');
});

// http 列出城市
app.get('/location', function * (next) {
  var data = yield service.listCity();
  this.body = this.template.render('templates/city.html', data, {
    projectId: this.session.project && this.session.project.id
  });
});

// http 列出城市开通的项目
app.get('/location/:cityId', function * (next) {
  var data = yield service.listProject(this.params.cityId);
  var city = yield service.getCity(this.params.cityId);
  this.body = this.template.render('templates/project.html', data, {
    city: city
  });
});

// http 选择项目
app.get('/location/choose/:projectId', function * (next) {
  var data = null;
  if (this.session.user) {
    data = yield service.refreshProject(this.session.user.id, this.params.projectId);
  }
  else {
    data = yield service.getProject(this.params.projectId);
  }
  this.session.city = data.city;
  this.session.project = data.project;
  this.redirect('/');
});