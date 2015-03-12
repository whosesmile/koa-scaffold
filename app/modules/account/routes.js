var app = require('../../app');
var support = require('../../support');
var service = require('./service');
var _ = require('lodash');

// http 个人主页
app.get('/profile', function * (next) {
  this.body = this.template.render('templates/profile.html', {
    user: this.session.user
  });
});

// http 获取登录页面
app.get('/login', function * (next) {
  this.body = this.template.render('templates/login.html', {
    next: this.query.next
  });
});

// http 登录逻辑
app.post('/login', function * (next) {
  var form = this.request.body;
  var error = null;

  // 校验手机
  if (!form.mobile || _.trim(form.mobile) === '') {
    error = '请输入您的手机号';
  }
  // 校验密码
  else if (!form.password) {
    error = '请输入您的密码';
  }

  if (error) {
    return this.body = this.template.render('templates/login.html', {
      mobile: form.mobile,
      error: error
    });
  }

  var data = yield service.login(form.mobile, form.password, this.session.projectId, this.ip);

  // 登录成功  
  if (data) {
    this.session.user = data.user;
    this.session.city = data.city;
    this.session.project = data.project;
    this.redirect(this.query.next || '/');
  }
  else {
    return this.body = this.template.render('templates/login.html', {
      mobile: form.mobile,
      error: '您的账户不存在或密码错误'
    });
  }
});

// http 登出
app.get('/logout', function * (next) {
  // 保留选择的项目
  _.forIn(this.session.inspect(), function (value, key) {
    if (key !== 'projectId') {
      delete this.session[key];
    }
  }, this);
  this.redirect('/login');
});

// http 获取注册页面
app.get('/register', function * (next) {
  this.body = this.template.render('templates/register.html', {
    next: this.query.next
  });
});

// http 注册逻辑
app.post('/register', function * (next) {
  var form = this.request.body;
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
    this.body = this.template.render('templates/register.html', form, {
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
    this.redirect('/account/refined');
  }
  else {
    this.body = this.template.render('templates/register.html', form, {
      next: this.query.next,
      error: '手机号已经被注册，请直接登录'
    });
  }
});

// ajax 发送注册验证码
app.post('/register/captcha', function * (next) {
  var form = this.request.body;
  // 校验手机
  if (!form.mobile || _.trim(form.mobile) === '') {
    this.body = this.template.render(400, '请输入您的手机号码');
    return;
  }
  var data = yield service.getCaptcha(form.mobile, 1);
  this.session.captcha = {
    code: data.captcha,
    time: new Date().getTime() // 记录时间
  };
  this.body = this.template.render(200);
});

// ajax 验证手机是否已经注册过
app.get('/account/exists', function * (next) {
  var mobile = this.request.query.mobile;
  if (_.isUndefined(mobile)) {
    this.body = support.response.badRequest('请输入手机号码');
  }
  else {
    this.body = yield service.exists(mobile);
  }
});

// ajax 找回密码验证码
app.post('/forgot/captcha', function * (next) {
  var form = this.request.body;
  // 校验手机
  if (!form.mobile || _.trim(form.mobile) === '') {
    this.body = this.template.render(400, '请输入您的手机号码');
    return;
  }
  var data = yield service.getCaptcha(form.mobile, 2);
  this.session.captcha = {
    code: data.captcha,
    time: new Date().getTime() // 记录时间
  };
  this.body = this.template.render(200);
});

// http 完善信息页面
app.get('/account/refined', loginRequired, function * (next) {
  this.body = this.template.render('templates/refined.html', this.session.user);
});

// http 更新用户信息
app.post('/account/refined', loginRequired, function * (next) {
  // 清理无效的字段
  var form = support.clean(this.request.body);
  // 手机号不允许更新
  delete form.mobile;
  // 更新用户
  this.session.user = yield service.update(_.merge({}, this.session.user, form));

  // 是否保存为默认收货人
  if (form.address) {
    yield service.createAddress(this.session.user.id, this.session.user.name, this.session.user.mobile, this.session.user.sex, 1);
  }

  this.redirect(this.query.next || '/');
});

// http 修改用户
app.post('/account/update', loginRequired, function * (next) {
  // 清理无效的字段
  var form = support.clean(this.request.body);
  // 手机号不允许更新
  delete form.mobile;
  // 更新用户
  this.session.user = yield service.update(_.merge({}, this.session.user, form));

  // isAjax
  if (this.request.isAjax) {
    this.body = this.template.render(200, this.session.user);
  }
  else {
    this.redirect('/account/settings');
  }
});

// http 个人资料
app.get('/account/settings', loginRequired, function * (next) {
  this.body = this.template.render('templates/settings.html', {
    user: this.session.user,
    project: this.session.project
  });
});

// 个人签名
app.get('/account/signature', loginRequired, function * (next) {
  this.body = this.template.render('templates/signature.html', {
    signature: this.session.user.signature
  });
});

// http 修改密码
app.get('/account/password', loginRequired, function * (next) {
  this.body = this.template.render('templates/password.html');
});

// http 修改密码
app.post('/account/password', loginRequired, function * (next) {
  var form = this.request.body;

  var error = null;
  if (!form.oldpwd || form.oldpwd === '') {
    error = '请输入原密码';
  }
  else if (!form.newpwd || form.newpwd === '') {
    error = '请输入新密码';
  }
  else if (form.newpwd.length < 6) {
    error = '新密码至少为6位';
  }
  if (error) {
    return this.body = this.template.render('templates/password.html', {
      error: error
    });
  }

  // 修改密码
  var data = yield service.updatePassword(this.session.user.id, form.oldpwd, form.newpwd);
  if (data) {
    this.redirect('/profile');
  }
  else {
    return this.body = this.template.render('templates/password.html', {
      error: '原密码输入不正确'
    });
  }
});

// http 忘记密码
app.get('/account/forgot', function * (next) {
  this.body = this.template.render('templates/forgot.html');
});

// http 忘记密码
app.post('/account/forgot', function * (next) {

  var form = this.request.body;
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
    return this.body = this.template.render('templates/forgot.html', form, {
      error: error
    });
  }

  // 清除缓存的验证码
  delete this.session.captcha;

  // 验证手机账户是否存在
  var exists = yield service.exists(form.mobile);
  if (!exists) {
    this.body = this.template.render('templates/forgot.html', form, {
      error: '手机号尚不存在，<a class="text-gray" href="/register">点击注册</a>'
    });
  }
  else {
    var success = yield service.resetPassword(form.mobile, form.password);
    if (success) {
      this.redirect('/logout');
    }
    else {
      this.body = this.template.render('templates/register.html', form, {
        error: '重置密码失败，请重新验证'
      });
    }
  }
});

// 千丁券列表
app.get('/account/coupons', function * () {
  var data = yield service.listCoupons(this.session.user.id);
  this.body = this.template.render('templates/coupons.html', data);
});

// 查看优惠券详情
app.get('/account/coupon/:code', function * () {
  var data = yield service.couponDetails(this.params.code);
  this.body = this.template.render('templates/coupon.html', data);
});

// 查看优惠券详情
app.get('/account/addcoupon', function * () {
  this.body = this.template.render('templates/addcoupon.html');
});

// 添加千丁券
app.post('/account/addcoupon', function * () {
  var form = this.request.body;
  var data = yield service.addCoupon(this.session.user.id, this.session.user.name, form.code);

  if (data) {
    this.redirect('/account/coupons');
  }
  else {
    this.body = this.template.render('templates/addcoupon.html', {
      error: '您输入的千丁券序列号不正确'
    });
  }
});