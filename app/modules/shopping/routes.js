var _ = require('lodash');
var app = require('../../app');
var service = require('./service');
var accountService = require('../account/service');

// 需要SESSION存在多步form
var multiformRequired = function * (next) {
  if (this.session.form) {
    yield next;
  }
  else {
    this.redirect('/shopping');
  }
};

// 团购首页
app.get('/shopping', function * (next) {
  var data = yield service.shopping(this.session.projectId);
  this.body = this.template.render('templates/shopping.html', data);
});

// 团购分类
app.get('/shopping/category', function * (next) {
  var data = yield service.listCategory(this.session.projectId);
  this.body = this.template.render('templates/category.html', data);
});

// 分类频道
app.get('/shopping/channel/:id', validator('number:id', function * () {
  var data = yield service.listGoods(this.session.projectId, this.params.id);
  this.body = this.template.render('templates/channel.html', data);
}));

// 商品详情
app.get('/shopping/details/:id', validator('number:id', function * (next) {
  var data = yield service.details(this.params.id, this.session.user ? this.session.user.id : null);
  this.body = this.template.render('templates/details.html', data);
}));

// 列举购物车
app.get('/shopping/cart', loginRequired, function * (next) {
  var data = yield service.listCart(this.session.user.id, this.session.projectId);
  this.body = this.template.render('templates/cart.html', data);
});

// 加入购物车
app.post('/shopping/cart', loginRequired, function * (next) {
  var form = this.request.body;
  var result = service.addCart(this.session.user.id, this.session.projectId, form.id, form.count || 1);
  if (result) {
    this.body = this.template.render(200);
  }
  else {
    this.body = this.template.render(500, '添加商品失败');
  }
});

// 从购物车删除商品
app.delete('/shopping/cart', loginRequired, function * (next) {
  var form = this.request.body;
  var result = service.deleteCart(this.session.user.id, this.session.projectId, form.id);
  if (result) {
    this.body = this.template.render(200);
  }
  else {
    this.body = this.template.render(500, '删除商品失败');
  }
});

// 列举收藏
app.get('/shopping/collect', loginRequired, function * () {
  var data = yield service.listCollect(this.session.user.id, this.session.projectId);
  this.body = this.template.render('templates/collect.html', data);
});

// 收藏商品
app.post('/shopping/collect', loginRequired, function * () {
  var form = this.request.body;
  var result = yield service.collect(this.session.user.id, this.session.projectId, form.id);
  if (result) {
    this.body = this.template.render(200);
  }
  else {
    this.body = this.template.render(500, '收藏商品失败');
  }
});

// 取消收藏
app.delete('/shopping/collect', loginRequired, function * () {
  var form = this.request.body;
  var result = yield service.delcollect(this.session.user.id, this.session.projectId, form.id);
  if (result) {
    this.body = this.template.render(200);
  }
  else {
    this.body = this.template.render(500, '取消收藏失败');
  }
});
// 确认订单
app.post('/shopping/confirm', loginRequired, function * (next) {
  var form = this.request.body;
  // 记录 以便切换地址可以重定向
  this.session.form = form;
  this.redirect('/shopping/confirm');
});

// 确认订单 重定向
app.get('/shopping/confirm', loginRequired, multiformRequired, function * (next) {
  var form = this.session.form;
  var list = yield service.findsGoods(_.flatten([form.goods]), this.session.user.id);
  // 收货人信息
  var address = form.address;
  if (!address) {
    address = yield accountService.defaultAddress(this.session.user.id);
  }
  // 物业地址
  var paddress = form.paddress || this.session.project.addresses[0];

  this.body = this.template.render('templates/confirm.html', list, {
    address: address,
    paddress: paddress,
    phones: this.session.project.phones
  });
});

// 选择收货人 - 确认订单
app.get('/shopping/address', loginRequired, multiformRequired, function * (next) {
  var data = yield accountService.listAddress(this.session.user.id);
  this.body = this.template.render('templates/address.html', data);
});

// 选择收货人 - 确认订单
app.get('/shopping/address/:id', loginRequired, multiformRequired, function * (next) {
  this.session.form.address = yield accountService.getAddress(this.session.user.id, this.params.id);
  this.redirect('/shopping/confirm');
});

// 选择物业地址
app.get('/shopping/paddress', loginRequired, multiformRequired, function * (next) {
  this.body = this.template.render('templates/paddress.html', {
    list: this.session.project.addresses
  });
});

// 选择物业地址
app.get('/shopping/paddress/:id', loginRequired, multiformRequired, function * (next) {
  var list = this.session.project.addresses;
  for (var i = 0; i < list.length; i++) {
    if (list[i].id === Number(this.params.id)) {
      this.session.form.paddress = list[i];
      break;
    }
  }
  this.redirect('/shopping/confirm');
});

// 推荐频道
app.get('/shopping/promotes', function * (next) {
  this.body = this.template.render('templates/promotes.html');
});

// 确定下单
app.post('/shopping/placeorder', function * (next) {
  // TODO
});

// 订单详情
app.get('/shopping/order', function * (next) {
  this.body = this.template.render('templates/order.html');
});

// 现金支付
app.get('/shopping/cashpay', function * (next) {
  this.body = this.template.render('templates/cashpay.html');
});

// 支付成功
app.get('/shopping/success', function * (next) {
  this.body = this.template.render('templates/success.html');
});

// 支付失败
app.get('/shopping/failure', function * (next) {
  this.body = this.template.render('templates/failure.html');
});