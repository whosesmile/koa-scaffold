var whost = require('../../config').whost;
var request = require('../../support').request;

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
 * @param  {string} mobile 手机号码
 * @return promise
 */
exports.exists = function (mobile) {
  return request({
    url: whost + '/user/app/user/register.json',
    method: 'get',
    qs: {
      mobile: mobile.tirm()
    }
  });
};