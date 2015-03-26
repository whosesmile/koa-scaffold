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

/*+ 购物车增删改查操作 +*/

// 列举
app.get('/shopping/cart', loginRequired, function * (next) {
  var data = yield service.listCart(this.session.user.id, this.session.projectId);
  this.body = this.template.render('templates/cart.html', data);
});

// 添加
app.post('/shopping/cart', loginRequired, function * (next) {
  var form = this.request.body;
  var result = yield service.addCart(this.session.user.id, this.session.projectId, form.goods, form.count || 1);
  this.body = result ? this.template.render(200) : this.template.render(500, '添加商品失败');
});

// 更新
app.put('/shopping/cart', loginRequired, function * (next) {
  var form = this.request.body;
  var result = yield service.updateCart(this.session.user.id, this.session.projectId, form.goods, form.count || 1);
  this.body = result ? this.template.render(200) : this.template.render(500, '更新购物车失败');
});

// 删除
app.delete('/shopping/cart', loginRequired, function * (next) {
  var form = this.request.body;
  var result = yield service.deleteCart(this.session.user.id, this.session.projectId, form.ids);
  this.body = result ? this.template.render(200) : this.template.render(500, '删除商品失败');
});

/*- 购物车逻辑结束 -*/

/*+ 收藏增删改查 +*/

// 列举
app.get('/shopping/collect', loginRequired, function * () {
  var data = yield service.listCollect(this.session.user.id, this.session.projectId);
  this.body = this.template.render('templates/collect.html', data);
});

// 添加
app.post('/shopping/collect', loginRequired, function * () {
  var form = this.request.body;
  var result = yield service.collect(this.session.user.id, this.session.projectId, form.id);
  this.body = result ? this.template.render(200) : this.template.render(500, '收藏商品失败');
});

// 删除
app.delete('/shopping/collect', loginRequired, function * () {
  var form = this.request.body;
  var result = yield service.delcollect(this.session.user.id, this.session.projectId, form.id);
  this.body = result ? this.template.render(200) : this.template.render(500, '取消收藏失败');
});

/*- 收藏逻辑结束 -*/

/*+ 确认订单相关逻辑 +*/

// 提交商品
app.post('/shopping/confirm', loginRequired, function * (next) {
  var form = this.request.body;
  this.session.form = form;
  this.redirect('/shopping/confirm');
});

// 展示最新的确认信息
app.get('/shopping/confirm', loginRequired, multiformRequired, function * (next) {
  // 从session中获取最新的提交信息
  var form = this.session.form;
  var counts = _.flatten([form.count || 1]);
  var data = yield service.findsGoods(_.flatten([form.goods]), this.session.user.id);

  // 收货人
  var address = form.address;
  if (!address) {
    address = yield accountService.defaultAddress(this.session.user.id);
  }
  // 物业地址
  var paddress = form.paddress || this.session.project.addresses[0];

  this.body = this.template.render('templates/confirm.html', data, {
    counts: counts,
    address: address,
    paddress: paddress,
    phones: this.session.project.phones
  });
});

// 确认订单 - 列举收货人
app.get('/shopping/address', loginRequired, multiformRequired, function * (next) {
  var data = yield accountService.listAddress(this.session.user.id);
  this.body = this.template.render('templates/address.html', data);
});

// 确认订单 - 选择收货人
app.get('/shopping/address/:id', loginRequired, multiformRequired, function * (next) {
  this.session.form.address = yield accountService.getAddress(this.session.user.id, this.params.id);
  this.redirect('/shopping/confirm');
});

// 确认订单 - 列举物业地址
app.get('/shopping/paddress', loginRequired, multiformRequired, function * (next) {
  this.body = this.template.render('templates/paddress.html', {
    list: this.session.project.addresses
  });
});

// 确认订单 - 选择物业地址
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

/*- 确认订单相关逻辑结束 -*/

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