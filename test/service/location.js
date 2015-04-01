var assert = require('assert');
var service = require('../../app/modules/location/service');
var _ = require('lodash');

describe('location service', function () {
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

  it('#refreshProject should return user data', function (done) {
    service.refreshProject(user.id, project.id).then(function (data) {
      assert(_.isObject(data.entity.project));
      done();
    }, function (rej) {
      done(rej);
    });
  });

});