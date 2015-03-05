var assert = require('assert');
var service = require('../../app/modules/account/service');
var _ = require('lodash');

describe('modules/account/service.js', function () {

  it('updateUser 应该能够更新用户信息:', function(done) {
    service.updateUser({
      id: 68074,
      name: '李双宝'
    }).then(function(data) {
      console.log(data)
      assert(true);
    });
  });

});