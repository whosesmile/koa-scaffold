var app = require('../../app');
var response = require('../../support');
var service = require('./service');
var parser = require('koa-body')();
var _ = require('lodash');

// 个人主页
app.get('/profile', function * (next) {
  this.body = template.render('templates/profile.html');
});

// 获取登录页面
app.get('/login', function * (next) {
  this.body = template.render('templates/login.html', {
    next: this.query.next
  });
});

// 登录逻辑
app.post('/login', parser, function * (next) {
  var form = this.request.body;
  var data = yield service.login(form.mobile, form.password, this.session.projectId, this.ip);
  data = data.entity;
  // 缓存用户
  this.session.user = {
    id: data.user.id,
    name: data.user.name,
    nick: data.user.nick,
    mobile: data.user.mobile,
    sex: data.user.sex,
    image: data.user.image,
    thumb: data.user.thumb
  };
  // 缓存城市
  this.session.city = {
    id: data.project.region_id,
    name: data.project.region_name
  };
  // 缓存项目
  this.session.project = {
    id: data.project.id,
    name: data.project.name,
    phones: data.project.phones,
    addresses: data.project.addresses
  };
  this.body = template.render('templates/login.html', {
    mobile: form.mobile
  });
  this.redirect(this.query.next || '/');
});

// 登出
app.get('/logout', function * (next) {
  // 保留选择的项目
  _.forIn(this.session.inspect(), function (value, key) {
    if (key !== 'projectId') {
      delete this.session[key];
    }
  }, this);
  this.redirect('/login');
});

// 获取注册页面
app.get('/register', parser, function * (next) {
  var form = this.request.body;
  this.body = template.render('templates/register.html', {
    next: this.query.next
  });
});

// 忘记密码
app.get('/forgot', function * (next) {
  this.body = template.render('templates/forgot.html');
});

// 发送注册验证码
app.get('/register/captcha', function * (next) {
  var data = yield service.getCaptcha(this.query.mobile, 1);
  this.body = {
    code: 200,
    data: data
  };
});

// mobile exists
app.get('/account/exists', function * (next) {
  var mobile = this.request.query.mobile;
  if (_.isUndefined(mobile)) {
    this.body = response.badRequest('请输入手机号码');
  }
  else {
    this.body = yield service.exists(mobile);
  }
});