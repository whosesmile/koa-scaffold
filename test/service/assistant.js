var assert = require('assert');
var service = require('../../app/modules/assistant/service');
var _ = require('lodash');

describe('assistant service', function () {
  var user = {
    id: 33249,
    name: '李双宝',
    mobile: '18610535297'
  };

  var address = {
    "id": 2431,
    "sex": 1,
    "phone": "18610535297",
    "address": "阿猫家",
    "name": "梁山伯",
    "defaultFlag": 1,
    "postcode": "18610535297"
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

  it('#listNotice 应该返回通知列表', function (done) {
    service.listNotice(project.id).then(function (data) {
      assert(_.isArray(data.list));
      done();
    }, function (rej) {
      done(rej);
    });
  });

});