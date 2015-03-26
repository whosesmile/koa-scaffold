var whost = require('../../config').whost;
var request = require('../../support').request;

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
 * @param  {array:goodsId} list [商品主键列表]
 * @return promise
 */
exports.findsGoods = function (list) {
  return request({
    url: whost + '/market/getGoodsByIds',
    method: 'get',
    qs: {
      goodsId: list.join(',')
    }
  });
};

/**
 * 添加商品到购物车
 * @param  {number} userId    用户主键
 * @param  {number} projectId 项目主键
 * @param  {number} goodsId   商品主键
 * @param  {number} count     商品数量
 * @return {promise}
 */
exports.addCart = function (userId, projectId, goodsId, count) {
  return request({
    url: whost + '/market/goods/addCart',
    method: 'post',
    form: {
      userId: userId,
      projectId: projectId,
      goodsId: goodsId,
      count: count
    }
  }).then(function () {
    return true;
  }, function () {
    return false;
  });
};

/**
 * 删除购物车中的指定商品
 * @param  {number} userId    用户主键
 * @param  {number} projectId 项目主键
 * @param  {number} goodsId   商品主键
 * @return {promise}
 */
exports.deleteCart = function (userId, projectId, goodsId) {
  return request({
    url: whost + '/market/goods/delCart',
    method: 'post',
    form: {
      userId: userId,
      projectId: projectId,
      goodsIds: [].concat(goodsId).join(',')
    }
  }).then(function () {
    return true;
  }, function () {
    return false;
  });
};

/**
 * 获取购物车列表
 * @param  {number} userId    用户主键
 * @param  {number} projectId 项目主键
 * @return {promise}
 */
exports.listCart = function (userId, projectId) {
  return request({
    url: whost + '/market/goods/getCartGoods',
    method: 'get',
    qs: {
      userId: userId,
      projectId: projectId
    }
  });
};

/**
 * 收藏商品
 * @param  {number} userId    用户ID
 * @param  {number} projectId 项目ID
 * @param  {number} goodsId   商品ID
 * @return {promise}
 */
exports.collect = function (userId, projectId, goodsId) {
  return request({
    url: whost + '/market/goods/collect',
    method: 'post',
    qs: {
      userId: userId,
      goodsId: goodsId,
      projectId: projectId
    }
  }).then(function () {
    return true;
  }, function () {
    return false;
  });
};

/**
 * 取消收藏
 * @param  {number} userId    用户ID
 * @param  {number} projectId 项目ID
 * @param  {number} goodsId   商品ID
 * @return {promise}
 */
exports.delcollect = function (userId, projectId, goodsId) {
  return request({
    url: whost + '/market/goods/delCollect',
    method: 'post',
    qs: {
      userId: userId,
      goodsId: goodsId,
      projectId: projectId
    }
  }).then(function () {
    return true;
  }, function () {
    return false;
  });
};

/**
 * 列举收藏列表
 * @param  {number} userId    用户ID
 * @param  {number} projectId 项目ID
 * @return {promise}
 */
exports.listCollect = function (userId, projectId) {
  return request({
    url: whost + '/market/goods/getColGoods',
    method: 'get',
    qs: {
      userId: userId,
      projectId: projectId
    }
  });
};