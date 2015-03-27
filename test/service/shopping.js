var assert = require('assert');
var service = require('../../app/modules/shopping/service');
var _ = require('lodash');

describe('account service', function () {
  var user = {
    id: 33249,
    name: '李双宝',
    mobile: '18610535297'
  };
  var project = {
    id: 62,
    name: '水晶郦城',
    phones: ['010-6627159'],
    addresses: [{
      id: 247,
      address: '重庆水晶郦城物业管理处-test'
    }]
  };

  var order = {
    "total": "504.00",
    "totalRealpay": "504.00",
    "orderCode": "LG2015032715214352974127",
    "orderId": 105579
  };

  it('#listOrder should return user orders', function (done) {
    service.listOrder(user.id, project.id).then(function (data) {
      assert(_.isArray(data.list));
      done();
    }, function (rej) {
      done(rej);
    });
  });

  it('#getOrder should return order', function (done) {
    service.getOrder(order.orderId).then(function (data) {
      assert(data.order.id === order.orderId);
      done();
    }, function (rej) {
      done(rej);
    });
  });

});