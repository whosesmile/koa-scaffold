var app = require('../../app');
var service = require('./service');

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
app.get('/shopping/channel/:id', function * (next) {
  var data = yield service.listGoods(this.session.projectId, this.params.id);
  this.body = this.template.render('templates/channel.html', data);
});

// 商品详情
app.get('/shopping/details/:id', function * (next) {
  var user = this.session.user;
  var data = yield service.details(this.params.id, user ? user.id : null);
  this.body = this.template.render('templates/details.html', data);
});

// 加入购物车
app.post('/shopping/add2Cart', loginRequired, function * (next) {
  var form = this.request.body;
  var result = service.add2Cart(this.session.user.id, this.session.projectId, form.id, form.count || 1);
  if (result) {
    this.body = this.template.render(200);
  }
  else {
    this.body = this.template.render(500, '添加至购物车失败');
  }
});

// 列举购物车
app.get('/shopping/cart', loginRequired, function * (next) {
  var data = yield service.listCart(this.session.user.id, this.session.projectId);
  this.body = this.template.render('templates/cart.html', data);
});

// 推荐频道
app.get('/shopping/promotes', function * (next) {
  this.body = this.template.render('templates/promotes.html');
});

// 选择商品
app.get('/shopping/confirm', function * (next) {
  this.body = this.template.render('templates/confirm.html');
});

// 选择收货人
app.get('/shopping/address', function * (next) {
  this.body = this.template.render('templates/address.html');
});

// 选择收货地址
app.get('/shopping/paddress', function * (next) {
  this.body = this.template.render('templates/paddress.html');
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
app.post('/shopping/uncollect', loginRequired, function * () {
  var form = this.request.body;
  var result = yield service.cancelCollect(this.session.user.id, this.session.projectId, form.id);
  if (result) {
    this.body = this.template.render(200);
  }
  else {
    this.body = this.template.render(500, '取消收藏失败');
  }
});

// 列举收藏
app.get('/shopping/collect', loginRequired, function * () {
  var data = yield service.listCollect(this.session.user.id, this.session.projectId);
  this.body = this.template.render('templates/collect.html', data);
});