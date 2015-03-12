var whost = require('../../config').whost;
var request = require('../../support').request;
var _ = require('lodash');

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
      ip: ip.replace('::ffff:', ''),
      device: 'html5',
      sourceType: 0
    }
  }).then(function (res) {
    // 重构数据
    var data = res.entity;
    return {
      user: {
        id: data.user.id,
        name: data.user.name,
        nick: data.user.nick,
        mobile: data.user.mobile,
        sex: [0, 1, -1].indexOf(data.user.sex) === -1 ? 1 : data.user.sex,
        image: data.user.image,
        thumb: data.user.thumb,
        signature: data.user.signature
      },
      city: {
        id: data.project.region_id,
        name: data.project.region_name
      },
      project: {
        id: data.project.id,
        name: data.project.name,
        phones: data.project.phones,
        addresses: data.project.addresses
      }
    };
  }, function (rej) {
    return false;
  });
};

// 注册账号
// 必传参数： mobile: 电话 pwd: 密码 regionId: 城市id projectId: 社区id
// 选传参数： buildingId: 楼栋id roomId: 房屋id qrcodesId: 二维码id role: 身份
exports.register = function (mobile, password, projectId, ip) {
  return request({
    url: whost + '/user/app/user/register.json',
    method: 'post',
    form: {
      mobile: mobile,
      pwd: password,
      projectId: projectId,
      sourceType: 0
    }
  }).then(function (data) {
    // 注册返回的数据不完整 需要通过登录获取
    return exports.login(mobile, password, projectId, ip);
  });
};

/**
 * 验证手机是否已经注册
 * @param  {string} mobile 手机
 * @return promise
 */
exports.exists = function (mobile) {
  return request({
    url: whost + '/user/app/user/isRegister.json',
    method: 'get',
    qs: {
      mobile: _.trim(mobile),
      sourceType: 0
    }
  }).then(function () {
    return true;
  }, function () {
    return false;
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
      action: action // action: 1 注册 2 忘记密码  3 修改手机号码 4 绑定房间
    }
  }).then(function (data) {
    return {
      captcha: data.entity
    };
  });
};

/**
 * 更新用户信息
 * @param  {object} form 用户数据
 * @return promise
 */
// 必传参数 id
// 选传字段 mobile nick name sex image thumb(缩略图)
// TODO: POST乱码
exports.update = function (form) {
  return request({
    url: whost + '/user/app/user/update.json',
    method: 'get',
    qs: form
  }).then(function (data) {
    data = data.entity;
    // 后台返回的数据不准确
    return {
      id: data.id,
      name: data.name,
      nick: data.nick,
      mobile: data.mobile,
      sex: [0, 1, -1].indexOf(data.sex) === -1 ? 1 : data.sex,
      image: data.image,
      thumb: data.thumb,
      signature: data.signature
    };
  });
};

/**
 * 更改密码
 * @param  {number} userId 用户主键
 * @param  {oldpwd} oldpwd 旧密码
 * @param  {newpwd} newpwd 新密码
 * @return promise
 */
exports.updatePassword = function (userId, oldpwd, newpwd) {
  return request({
    url: whost + '/user/app/user/updatePassword.json',
    method: 'post',
    form: {
      id: userId,
      oldPwd: oldpwd,
      newPwd: newpwd
    }
  }).then(function () {
    return true;
  }, function () {
    return false;
  });
};

/**
 * 重设密码
 * @param  {number} mobile 手机号
 * @param  {newpwd} newpwd 新密码
 * @return promise
 */
exports.resetPassword = function (mobile, newpwd) {
  return request({
    url: whost + '/user/app/user/updatePassword.json',
    method: 'post',
    form: {
      mobile: mobile,
      newPwd: newpwd,
      sourceType: 0
    }
  }).then(function () {
    return true;
  }, function () {
    return false;
  });
};

/**
 * 创建收货人地址
 * @param  {number} id  用户ID
 * @param  {string} address   收货人姓名
 * @param  {string} mobile    收货人电话
 * @param  {number} sex       收货人性别
 * @param  {number} asdefault 是否设为默认收货人
 * @return promise
 */
// TODO: POST乱码
exports.createAddress = function (id, name, mobile, sex, asdefault) {
  return request({
    url: whost + '/user/app/user/bindAddressee.json',
    method: 'get',
    qs: {
      userId: id,
      addresseeName: name,
      addresseePhone: mobile,
      addresseeSex: sex,
      defaultFlag: asdefault || 0,
      addresseeAddress: null,
      addresseePostcode: null
    }
  }).then(function (data) {
    return data.entity;
  });
};