var whost = require('../../config').whost;
var request = require('../../support').request;
var _ = require('lodash');

/**
 * 获取乐购数据
 * @param  {number} projectId 所选择的项目
 * @return promise
 */
exports.shopping = function (projectId) {
  return request({
    url: whost + '/market/index',
    method: 'get',
    qs: {
      projectId: projectId
    }
  });
};

/**
 * 获取乐购商品分类
 * @param  {number} projectId 所选择的项目
 * @return promise
 */
exports.listCategory = function (projectId) {
  return exports.shopping(projectId).then(function (data) {
    return {
      list: data.category
    };
  });
};

/**
 * 根据项目, 分类, 页码, 容量返回列表数据
 * @param  {number} projectId  [所属项目主键]
 * @param  {number} categoryId [所属分类编号]
 * @param  {number} page       [当前所在页码，默认值 1]
 * @param  {number} size       [每页容量大小，默认值 10]
 * @return {object}            [object]
 */
exports.listGoods = function (projectId, categoryId, page, size) {
  page = page || 1;
  size = size || 10;

  return request({
    url: whost + '/market/goods/list',
    method: 'get',
    qs: {
      projectId: projectId,
      categoryId: categoryId,
      pageNo: page,
      pageSize: size
    }
  });
};

/**
 * 返回商品详情
 * @param  {number} id     商品ID
 * @param  {number} userId 用户ID
 * @return promise
 */
exports.details = function (id, userId) {
  return request({
    url: whost + '/market/goods/info',
    method: 'get',
    qs: {
      id: id,
      userId: userId
    }
  });
};

/**
 * 根据商品主键列表返回推荐商品列表
 * @param  {string} ids [商品主键列表]
 * @return {type}         [description]
 */
// proxy: /market/getGoodsByIds
// goodsId
exports.listPromotes = function (ids) {
  // TODO
  return {};
};

exports.placeOrder = function () {

};

// var counter = {};

// var i = 10;
// while (i--) {
//   request('http://127.0.0.1:8000', function (err, res) {
//     counter[res.body] = (counter[res.body] || 0) + 1;
//     console.log(counter)
//   });
// }