var request = require('request');

/**
 * 根据项目, 分类, 页码, 容量返回列表数据
 * @param  {number} projectId  [所属项目主键]
 * @param  {number} categoryId [所属分类编号]
 * @param  {number} page       [当前所在页码，默认值 1]
 * @param  {number} size       [每页容量大小，默认值 10]
 * @return {object}            [object]
 */
// proxy: /market/goods/list
// projectId & categoryId &  pageNo & pageSize
exports.listGoods = function (projectId, categoryId, page, size) {
  page = page || 1;
  size = size || 10;

  return new Promise(function (resolve, reject) {
    // request(whost + '/market/goods/list', function (err, res) {
    //   err ? reject(err) : resolve(res);
    // });

    request('http://127.0.0.1:8080/test', function (err, res) {
      err ? reject(err) : resolve(JSON.parse(res.body));
    });
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

/**
 * 返回商品详情
 * @return {object}
 */
// proxy: /market/goods/info
// id & userId
exports.goodsDetail = function (id, userId) {
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