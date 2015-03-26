var assert = require('assert');
var service = require('../../app/modules/account/service');
var _ = require('lodash');

describe('account service', function () {
  var user = {
    id: 33208,
    name: '李双宝',
    mobile: '18610535297'
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

  it('#exists method should return true for ' + user.mobile, function (done) {
    service.exists(user.mobile).then(function (exist) {
      assert(exist === true);
      done();
    }, function (rej) {
      done(rej);
    });
  });

  it('#exists method should return false for 18600000000', function (done) {
    service.exists('18600000000').then(function (exist) {
      assert(exist === false);
      done();
    }, function (rej) {
      done(rej);
    });
  });

  it('#exists method should return false for 123456', function (done) {
    service.exists('777').then(function (exist) {
      assert(exist === false);
      done();
    }, function (rej) {
      done(rej);
    });
  });

  it('#defaultAddress should return default address', function (done) {
    service.defaultAddress(user.id).then(function (address) {
      assert(address);
      done();
    }, function (rej) {
      done(rej);
    });
  });


});