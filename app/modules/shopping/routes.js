var app = require('../../app');
var shoppingService = require('./service');

// 团购首页
app.get('/shopping', function * (next) {
  var data = yield shoppingService.shopping(this.session.projectId);
  this.body = this.template.render('templates/shopping.html', data);
});

// 团购分类
app.get('/shopping/category', function * (next) {
  var data = yield shoppingService.listCategory(this.session.projectId);
  this.body = this.template.render('templates/category.html', data);
});

// 分类频道
app.get('/shopping/channel/:id', function * (next) {
  var data = yield shoppingService.listGoods(this.session.projectId, this.params.id);
  this.body = this.template.render('templates/channel.html', data);
});

// 商品详情
app.get('/shopping/details/:id', function * (next) {
  var user = this.session.user;
  var data = yield shoppingService.details(this.params.id, user ? user.id : null);
  this.body = this.template.render('templates/details.html', data);
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