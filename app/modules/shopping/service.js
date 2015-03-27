var whost = require('../../config').whost;
var request = require('../../support').request;
var serialize = require('../../support').serialize;
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
 * 更新购物车
 * @param  {number} userId    用户主键
 * @param  {number} projectId 项目主键
 * @param  {number} goodsId   商品主键
 * @param  {number} count     商品数量
 * @return {promise}
 */
exports.updateCart = function (userId, projectId, goodsId, count) {
  return request({
    url: whost + '/market/goods/updateCart',
    method: 'post',
    form: {
      userId: userId,
      projectId: projectId,
      goodsIds: _.flatten([goodsId]).join(','),
      counts: _.flatten([count]).join(',')
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

/**
 * 下单
 * @param  {array}  goods       下单商品列表 包含goodsId和count两个字段
 * @param  {number} paymentType 支付方式 11现金 21 pos 31支付宝 41微信
 * @param  {object} address     收货地址
 * @param  {object} paddress    物业地址
 * @param  {object} user        下单人
 * @param  {object} city      所在城市
 * @param  {object} project     所在项目
 * @return {promise}
 */
exports.placeOrder = function (goods, paymentType, address, paddress, user, city, project) {
  // 后端格式要求 这里做下适配
  var params = {};
  goods.forEach(function (goods, index) {
    params['goodsList[' + index + '].goodsId'] = goods.goodsId;
    params['goodsList[' + index + '].count'] = goods.count;
  });

  return request({
    url: whost + '/market/goods/addOrder',
    method: 'post',
    form: _.merge(params, {
      userId: user.id,
      UserName: user.name,
      userPhone: user.mobile,
      paymentType: paymentType,
      addressId: address.id,
      addressName: address.name + '测试中文',
      addressPhone: address.phone,
      projectId: project.id,
      projectName: project.name,
      paddressId: paddress.id,
      paddressName: paddress.address,
      regionId: city.id,
      regionName: city.name,
      orderType: 1 // 1 APP 2 WX
    })
  }).then(function (res) {
    return res;
  }, function (rej) {
    return rej || {
      message: '下单失败，请您检查输入项'
    };
  });
};

/**
 * 列举用户订单
 * @param  {number} userId    用户ID
 * @param  {number} projectId 项目ID
 * @param  {number} page      页码 默认为 1
 * @param  {number} size      每页数量 默认为 10
 * @param  {number} status    status: 状态  (1,6,7)待处理 (2,3,4)其他
 * @return {promise}
 */
exports.listOrder = function (userId, projectId, page, size, status) {
  return request({
    url: whost + '/market/goods/getOrder',
    method: 'get',
    qs: {
      userId: userId,
      projectId: projectId,
      pageNo: page || 1,
      pageSize: size || 10,
      status: status
    }
  });
};

/**
 * 获取订单详情
 * @param  {number} id 订单ID
 * @return {promise}
 */
exports.getOrder = function (id) {
  return request({
    url: whost + '/market/goods/getOrderInfo',
    method: 'get',
    qs: {
      orderId: id
    }
  }).then(function (order) {
    return {
      order: order
    };
  }, function () {
    return null;
  });
};