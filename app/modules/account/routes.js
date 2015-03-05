var app = require('../../app');
var support = require('../../support');
var service = require('./service');
var _ = require('lodash');

// 个人主页
app.get('/profile', function * (next) {
  this.body = template.render('templates/profile.html', {
    user: this.session.user
  });
});

// 获取登录页面
app.get('/login', function * (next) {
  this.body = template.render('templates/login.html', {
    next: this.query.next
  });
});

// 登录逻辑
app.post('/login', function * (next) {
  var form = this.request.body;
  var data = yield service.login(form.mobile, form.password, this.session.projectId, this.ip);
  // 缓存数据
  this.session.user = data.user;
  this.session.city = data.city;
  this.session.project = data.project;
  // 登录成功
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
app.get('/register', function * (next) {
  this.body = template.render('templates/register.html', {
    next: this.query.next
  });
});

// 注册逻辑
app.post('/register', function * (next) {
  var form = this.request.body;
  var captcha = form.captcha;

  var error = null;

  // 校验手机
  if (!form.mobile || _.trim(form.mobile) === '') {
    error = '请输入您的手机号码';
  }
  // 校验验证码
  else if (!this.session.captcha || form.captcha !== this.session.captcha.code) {
    error = '验证码不正确，请重新输入';
  }
  // 校验有效时间 为了防止网络延迟 这里处理成 3 分钟
  else if (new Date().getTime() - this.session.captcha.time > 3 * 60 * 1000) {
    error = '验证码已过期，请重新获取';
  }
  // 校验密码
  else if (!form.password) {
    error = '请输入您的登录密码';
  }
  // 校验密码长度
  else if (form.password.length < 6) {
    error = '密码长度至少为6位';
  }

  if (error) {
    this.body = template.render('templates/register.html', form, {
      error: error,
      next: this.query.next
    });
    return;
  }

  // 清除缓存的验证码
  delete this.session.captcha;

  // 验证手机账户是否存在
  var exists = yield service.exists(form.mobile);
  if (!exists) {
    var data = yield service.register(form.mobile, form.password, this.session.projectId, this.ip);

    // 缓存数据
    this.session.user = data.user;
    this.session.city = data.city;
    this.session.project = data.project;

    // 跳转至完善信息页面
    this.redirect('/refined');
  }
  else {
    this.body = template.render('templates/register.html', form, {
      next: this.query.next,
      error: '手机号已经被注册，请直接登录'
    });
  }
});

// 发送注册验证码
app.post('/register/captcha', function * (next) {
  var form = this.request.body;
  // 校验手机
  if (!form.mobile || _.trim(form.mobile) === '') {
    this.body = template.render(400, {
      message: '请输入您的手机号码'
    });
    return;
  }
  var data = yield service.getCaptcha(form.mobile, 1);
  this.session.captcha = {
    code: data.captcha,
    time: new Date().getTime() // 记录时间
  };
  this.body = template.render(200);
});

// 验证手机是否已经注册过
app.get('/account/exists', function * (next) {
  var mobile = this.request.query.mobile;
  if (_.isUndefined(mobile)) {
    this.body = support.response.badRequest('请输入手机号码');
  }
  else {
    this.body = yield service.exists(mobile);
  }
});

// 忘记密码
app.get('/forgot', function * (next) {
  this.body = template.render('templates/forgot.html');
});

// 完善信息页面
app.get('/refined', loginRequired, function * (next) {
  this.body = template.render('templates/refined.html', this.session.user);
});

// 更新用户信息
app.post('/refined', loginRequired, function * (next) {
  var form = this.request.body;
  var user = yield service.updateUser({
    id: this.session.user.id,
    name: form.name,
    nick: form.name,
    sex: form.sex,
    mobile: form.mobile
  });

  // 刷新session
  this.session.user = user;

  // 是否保存为默认收货人
  if (form.address) {
    yield service.createAddress(this.session.user.id, form.name, form.mobile, form.sex, 1);
  }

  this.redirect(this.query.next || '/');
});