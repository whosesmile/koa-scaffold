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

// http 公告首页
app.get('/assistant/notices', function * (next) {
  var data = yield service.listNotice(this.session.project.id);
  this.body = this.template.render('templates/notices.html', data);
});

// http 公告详情
app.get('/assistant/notice/:id', function * (next) {
  var data = yield service.getNotice(this.params.id);
  this.body = this.template.render('templates/notice.html', data);
});

// http 物业账单
app.get('/assistant/charge', function * (next) {
  this.body = this.template.render('templates/charge.html');
});

// http 账单详情
app.get('/assistant/charge/:id', function * (next) {
  this.body = this.template.render('templates/details.html');
});