var assert = require('assert');
var service = require('../../app/modules/home/service');
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

  it('#home should return home info', function (done) {
    service.home(project.id).then(function (data) {
      assert(_.isArray(data.banners));
      assert(_.isArray(data.communitySales));
      done();
    }, function (rej) {
      done(rej);
    });
  });

});