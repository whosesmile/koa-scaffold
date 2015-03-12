var assert = require('assert');
var service = require('../../app/modules/account/service');
var _ = require('lodash');

describe('account service', function () {
  var user = {
    id: 33208,
    name: '李双宝'
  };

  // 优惠券相关
  it('#listCoupons', function (done) {
    service.listCoupons(user.id).then(function (data) {
      assert(_.isArray(data.list));
      done();
    }, function (rej) {
      done(rej);
    });
  });

  it('#addCoupon', function (done) {
    var code = '0271585854502';
    service.addCoupon(user.id, user.name, code).then(function (data) {
      assert(data.code, code)
      assert(data.status, 1)
      done();
    }, function (rej) {
      done(rej);
    });
  });

});