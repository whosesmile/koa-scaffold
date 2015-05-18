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

};

// 注册账号
// 必传参数： mobile: 电话 pwd: 密码 regionId: 城市id projectId: 社区id
// 选传参数： buildingId: 楼栋id roomId: 房屋id qrcodesId: 二维码id role: 身份
exports.register = function (mobile, password, projectId, ip) {

};

/**
 * 验证手机是否已经注册
 * @param  {string} mobile 手机
 * @return promise
 */
exports.exists = function (mobile) {

};

/**
 * 更新用户信息
 * @param  {object} form 用户数据
 * @return promise
 */
exports.update = function (form) {

};

/**
 * 更改密码
 * @param  {number} userId 用户主键
 * @param  {oldpwd} oldpwd 旧密码
 * @param  {newpwd} newpwd 新密码
 * @return promise
 */
exports.updatePassword = function (userId, oldpwd, newpwd) {

};

/**
 * 重设密码
 * @param  {number} mobile 手机号
 * @param  {newpwd} newpwd 新密码
 * @return promise
 */
exports.resetPassword = function (mobile, newpwd) {

};