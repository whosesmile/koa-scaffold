var whost = require('../../config').whost;
var request = require('../../support').request;
var _ = require('lodash');

// d
// 必穿参数： mobile: 电话 pwd: 密码 regionId: 城市id projectId: 社区id
// 选穿参数： buildingId: 楼栋id roomId: 房屋id qrcodesId: 二维码id role: 身份
/**
 * 验证登录是否成功
 * @param  {string} mobile   手机
 * @param  {string} password 密码
 * @return promise
 */
exports.login = function (mobile, password, projectId, ip) {
  return request({
    url: whost + '/user/app/user/login.json',
    method: 'post',
    form: {
      mobile: mobile,
      pwd: password,
      projectId: projectId,
      ip: ip,
      device: 'html5'
    }
  });
};

// 注册账号
// 必穿参数： mobile: 电话 pwd: 密码 regionId: 城市id projectId: 社区id
// 选穿参数： buildingId: 楼栋id roomId: 房屋id qrcodesId: 二维码id role: 身份
exports.register = function (params) {
  return request({
    url: whost + '/user/app/user/register.json',
    method: 'post',
    form: params
  });
};

/**
 * 验证手机是否已经注册
 * @param  {string} mobile 手机
 * @return promise
 */
exports.exists = function (mobile) {
  return request({
    url: whost + '/user/app/user/register.json',
    method: 'get',
    qs: {
      mobile: _.trim(mobile)
    }
  });
};

/**
 * 发送验证码
 * @param  {string} mobile 手机
 * @return promise
 */
exports.getCaptcha = function (mobile, action) {
  return request({
    url: whost + '/user/app/user/verify.json',
    method: 'get',
    qs: {
      mobile: _.trim(mobile),
      action: action
    }
  });
};