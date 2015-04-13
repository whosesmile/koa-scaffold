var config = require('../../config');
var whost = config.whost;
var request = require('../../support').request;

//
exports.signin = function (data) {
  return request({
    url: whost + '/market-activity/activity/saveOrUpdate.json',
    method: 'get',
    qs: {
      data: data
    }
  }).then(function (data) {
    return true;
  }, function (rej) {
    return rej;
  });
};

exports.activityInfo = function (mobile) {
  return request({
    url: whost + '/market-activity/activity/findRegistrationByMobile.json',
    method: 'get',
    qs: {
      mobile: mobile
    }
  });
};