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