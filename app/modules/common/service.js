var whost = require('../../config').whost;
var request = require('../../support').request;

/**
 * 列举城市列表
 * @return promise
 */
exports.listCity = function () {
  return request({
    url: whost + '/brick/app/data/city.json',
    method: 'get'
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
      qdPlatform: 'android'
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