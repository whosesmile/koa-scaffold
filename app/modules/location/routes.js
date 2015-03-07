var app = require('../../app');
var support = require('../../support');
var service = require('./service');
var _ = require('lodash');

// 列出城市
app.get('/location', function * (next) {
  var data = yield service.listCity();
  this.body = template.render('templates/city.html', data, {
    projectId: this.session.projectId
  });
});

// 定位城市
app.get('/location/geosearch', function * (next) {
  var data = yield service.getCity(this.query.lat, this.query.lng);
  if (data.error) {
    this.body = template.render(400, {
      message: '获取地理信息失败'
    });
  }
  else {
    var city = data.city.replace('市', '');
    var wrap = yield service.listCity();
    var list = wrap.list;
    for (var i = 0; i < list.length; i++) {
      for (var letter in list[i]) {
        var citys = list[i][letter];
        for (var j = 0; j < citys.length; j++) {
          if (citys[j].name === city) {
            return this.body = template.render(200, {
              id: citys[j].id,
              name: city
            });
          }
        }
      }
    }
    // 没找到
    this.body = template.render(400, {
      name: city,
      message: city + ' (暂时没有开放)'
    });
  }
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