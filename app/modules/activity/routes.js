var app = require('../../app');
var support = require('../../support');
var service = require('./service');
var _ = require('lodash');

// 邻聚有理
app.get('/activity/hotcycle', function * (next) {
  this.body = this.template.render('templates/hotcycle.html');
});

// 洗衣嘉年华
app.get('/activity/laundry', function * (next) {
  this.body = this.template.render('templates/laundry.html');
});

// 水晶郦城 亲子活动
app.get('/activity/qinzidiy', function * (next) {
  var data = {};
  if (this.session.qzmobile) {
    data = yield service.activityInfo(this.session.qzmobile);
    data.entity.childAge = data.entity.childAge.split(',');
  }
  this.body = this.template.render('templates/qinzidiy.html', data);
});

// 水晶郦城 亲子活动
app.get('/activity/qinzidiy/register', function * (next) {
  var data = {};
  if (this.session.qzmobile) {
    data = yield service.activityInfo(this.session.qzmobile);
    data.entity.childAge = data.entity.childAge.split(',');
  }
  this.body = this.template.render('templates/register.html', data);
});

// 水晶郦城 亲子活动
app.post('/activity/qinzidiy/register', function * (next) {
  var data = yield service.signin(this.request.body.data);

  if (data === true) {
    this.session.qzmobile = JSON.parse(this.request.body.data).mobile;
    this.body = this.template.render(200);
  }
  else {
    this.body = this.template.render(500, data.message || '签到失败');
  }

});