var config = require('../../config');
var whost = config.whost;
var request = require('../../support').request;

/**
 * 列举城市列表
 * @return promise
 */
exports.listCity = function () {
  return request({
    url: whost + '/brick/app/data/city.json',
    method: 'get',
    qs: {
      qdPlatform: 'weixin'
    }
  });
};

/**
 * 根据城市姓名返回城市实体
 * @param  {string} city 查找的城市名称
 * @return {promise}
 */
exports.findCity = function (city) {
  return exports.listCity().then(function (data) {
    var list = data.list;
    for (var i = 0; i < list.length; i++) {
      for (var letter in list[i]) {
        if (list[i].hasOwnProperty(letter)) {
          var citys = list[i][letter];
          for (var j = 0; j < citys.length; j++) {
            if (citys[j].name === city) {
              return {
                id: citys[j].id,
                name: city
              };
            }
          }
        }
      }
    }
    return null;
  });
};

/**
 * 根据经纬度获取城市信息
 * @param  {number} lat 维度
 * @param  {number} lng 精度
 * @return promise
 */
exports.geolocation = function (lat, lng) {
  return request({
    url: 'http://apis.map.qq.com/ws/geocoder/v1/',
    method: 'get',
    qs: {
      location: [lat, lng].join(','),
      key: config.mapkey,
      get_poi: 0
    }
  }).then(function (data) {
    if (data.status === 0) {
      return data.result.address_component;
    }
    return {
      error: data.message
    };
  });
};

/**
 * 列举某个城市的社区列表
 * @param  {number} cityId 城市
 * @return {promise}
 */
exports.listProject = function (cityId) {
  return request({
    url: whost + '/brick/app/data/project.json',
    method: 'get',
    qs: {
      cityId: cityId,
      qdPlatform: 'weixin'
    }
  });
};

/**
 * 列举项目楼宇列表
 * @param  {number} cityId    城市
 * @param  {number} projectId 项目
 * @return {promise}
 */
exports.listBuilding = function (cityId, projectId) {
  return request({
    url: whost + '/brick/app/data/building.json',
    method: 'get',
    qs: {
      cityId: cityId,
      projectId: projectId
    }
  });
};

/**
 * 列举房间号列表
 * @param  {number} cityId    城市
 * @param  {number} projectId 项目
 * @param  {number} buildingId 楼宇
 * @return {promise}
 */
exports.listRoom = function (cityId, projectId, buildingId) {
  return request({
    url: whost + '/brick/app/data/room.json',
    method: 'get',
    qs: {
      cityId: cityId,
      projectId: projectId,
      buildingId: buildingId
    }
  });
};