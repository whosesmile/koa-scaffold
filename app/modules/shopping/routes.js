var app = require('../../app');
var shoppingService = require('./service');

// 团购首页
app.get('/shopping', function * (next) {
  var data = yield shoppingService.listGoods();
  console.log(data)
  this.body = template.render('templates/shopping.html', data);
});

// 分类频道
app.get('/shopping/channel', function * (next) {
  this.body = template.render('templates/channel.html');
});

// 推荐频道
app.get('/shopping/promotes', function * (next) {
  this.body = template.render('templates/promotes.html');
});

// 商品详情
app.get('/shopping/details', function * (next) {
  this.body = template.render('templates/details.html');
});

// 选择商品
app.get('/shopping/confirm', function * (next) {
  this.body = template.render('templates/confirm.html');
});

// 选择收货人
app.get('/shopping/address', function * (next) {
  this.body = template.render('templates/address.html');
});

// 选择收货地址
app.get('/shopping/paddress', function * (next) {
  this.body = template.render('templates/paddress.html');
});

// 确定下单
app.post('/shopping/placeorder', function * (next) {
  // TODO
});

// 订单详情
app.get('/shopping/order', function * (next) {
  this.body = template.render('templates/order.html');
});

// 现金支付
app.get('/shopping/cashpay', function * (next) {
  this.body = template.render('templates/cashpay.html');
});

// 支付成功
app.get('/shopping/success', function * (next) {
  this.body = template.render('templates/success.html');
});

// 支付失败
app.get('/shopping/failure', function * (next) {
  this.body = template.render('templates/failure.html');
});