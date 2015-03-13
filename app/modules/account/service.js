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
    qs: _.merge({
      sourceType: 0
    }, form)
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
 * @param  {number} userId  用户ID
 * @param  {object} address   收货人信息
 * @return promise
 */
// TODO: POST乱码
exports.createAddress = function (userId, address) {
  return request({
    url: whost + '/user/app/user/bindAddressee.json',
    method: 'get',
    qs: {
      userId: userId,
      addresseeName: address.name,
      addresseePhone: address.phone,
      addresseeSex: address.sex,
      defaultFlag: address.defaultFlag || 0,
      addresseeAddress: address.address,
      addresseePostcode: address.postcode
    }
  }).then(function (data) {
    return data.entity;
  }, function () {
    return false;
  });
};

/**
 * 更新收货人地址
 * @param  {number} userId    用户ID
 * @param  {object} address 收货人详细信息
 * @return {promise}
 */
exports.updateAddress = function (userId, address) {
  return request({
    url: whost + '/user/app/user/updateAddressee.json',
    method: 'get',
    qs: {
      userId: userId,
      addresseeId: address.id,
      addresseeName: address.name,
      addresseePhone: address.phone,
      addresseeSex: address.sex,
      defaultFlag: address.defaultFlag,
      addresseeAddress: address.address,
      addresseePostcode: address.postcode
    }
  }).then(function () {
    return true;
  }, function () {
    return false;
  });
};

/**
 * 删除收货人信息
 * @param  {[type]} userId    [description]
 * @param  {[type]} addressId [description]
 * @return {[type]}           [description]
 */
exports.deleteAddress = function (userId, addressId) {
  return request({
    url: whost + '/user/app/user/delAddressee.json',
    method: 'get',
    qs: {
      userId: userId,
      addresseeId: addressId
    }
  }).then(function () {
    return true;
  }, function () {
    return false;
  });
};

/**
 * 列举收货人信息
 * @param  {number} userId 用户ID
 * @return {promise}
 */
exports.listAddress = function (userId) {
  return request({
    url: whost + '/user/app/user/getAddressee.json',
    method: 'get',
    qs: {
      userId: userId
    }
  });
};

/**
 * 获取指定的收货地址
 * @param  {number} userId    用户ID
 * @param  {number} addressId 地址ID
 * @return {promise}
 */
exports.getAddress = function (userId, addressId) {
  return exports.listAddress(userId).then(function (data) {
    for (var i = 0; i < data.list.length; i++) {
      if (data.list[i].id === Number(addressId)) {
        return data.list[i];
      }
    }
    return null;
  });
};

/**
 * 获取优惠券列表
 * @param  {number} userId 用户ID
 * @param  {number} status 选传 1:未使用 2,已使用 3：已过期 4：已作废 5：未生效 6：已锁定
 * @return {promise}
 */
exports.listCoupons = function (userId, status) {
  return request({
    url: whost + '/market/coupon/list',
    method: 'get',
    qs: {
      userId: userId,
      status: status
    }
  }).then(function (data) {
    data.invalid = 0;
    // 将有效数据标记将过期时间小于7天的
    data.expiring = 0; // 即将过期的数量
    var current = new Date().getTime();
    data.list.sort(function (a, b) {
      return a.price > b.price;
    }).forEach(function (item) {
      if (item.status === 1) {
        if (current + 7 * 24 * 60 * 60 * 1000 > item.validEnd) {
          data.expiring += 1;
        }
      }
      else {
        data.invalid += 1;
      }
    });
    return data;
  });
};

/**
 * 添加优惠券
 * @param  {number} userId 用户ID
 * @param  {string} userName 用户名称
 * @param  {string} code 千丁券密码
 * @return {promise}
 */
exports.addCoupon = function (userId, userName, code) {
  return request({
    url: whost + '/market/coupon/useCoupon',
    method: 'post',
    form: {
      userId: userId,
      userName: userName,
      code: code
    }
  }).then(function (data) {
    return data;
  }, function () {
    return false;
  });
};

/**
 * 绑定优惠券
 * @param  {number} orderId 订单ID
 * @param  {string} code 千丁券密码
 * @return {promise}
 */
exports.bindCoupon = function (orderId, code) {
  return request({
    url: whost + '/market/coupon/bindCoupon',
    method: 'post',
    form: {
      orderId: orderId,
      code: code
    }
  });
};

/**
 * 解绑优惠券
 * @param  {string} code 千丁券密码
 * @return {promise}
 */
exports.unbindCoupon = function (code) {
  return request({
    url: whost + '/market/coupon/unbindCoupon',
    method: 'post',
    form: {
      code: code
    }
  });
};

/**
 * 优惠券详情
 * @param  {string} code 千丁券密码
 * @return {promise}
 */
exports.couponDetails = function (code) {
  return request({
    url: whost + '/market/coupon/info',
    method: 'get',
    qs: {
      code: code
    }
  });
};