var assert = require('assert');
var service = require('../../app/modules/common/service');
var _ = require('lodash');

describe('modules/common/service.js', function () {

  it('listCity 应该正常返回城市列表:', function (done) {
    service.listCity().then(function (res) {
      assert(res.code === 200, '服务器返回CODE异常');
      assert(_.isArray(res.data.list), '服务器返回列表数据异常');
      done();
    });
  });

  it('listProject 应该正常返回社区列表:', function (done) {
    service.listCity().then(function (res) {
      assert(res.data.list.length > 0, '城市列表不能为空');

      var city = null;
      _.forOwn(res.data.list[0], function (value) {
        city = value[0];
      });
      return city.id;
    }).then(function (cityId) {
      service.listProject(cityId).then(function (res) {
        assert(res.code === 200, '服务器返回CODE异常');
        assert(_.isArray(res.data.list), '服务器返回列表数据异常');
        done();
      });
    });
  });

  it('listBuilding 应该正常返回社区列表:', function (done) {
    service.listCity().then(function (res) {
      assert(res.data.list.length > 0, '城市列表不能为空');
      var city = null;
      _.forOwn(res.data.list[0], function (value) {
        city = value[0];
      });
      return city.id;
    }).then(function (cityId) {
      return service.listProject(cityId);
    }).then(function (res) {
      assert(res.data.list.length > 0, '项目列表不能为空');
      var project = res.data.list[0];
      return service.listBuilding(project.cityId, project.id);
    }).then(function (res) {
      assert(res.code === 200, '服务器返回CODE异常');
      assert(_.isArray(res.data.list), '服务器返回列表数据异常');
      done();
    });
  });

  it('listRoom 应该正常返回房间列表:', function (done) {
    var cityId = null;
    service.listCity().then(function (res) {
      assert(res.data.list.length > 0, '城市列表不能为空');
      var city = null;
      _.forOwn(res.data.list[0], function (value) {
        city = value[0];
      });
      return cityId = city.id;
    }).then(function (cityId) {
      return service.listProject(cityId);
    }).then(function (res) {
      assert(res.data.list.length > 0, '项目列表不能为空');
      var project = res.data.list[0];
      return service.listBuilding(project.cityId, project.id);
    }).then(function (res) {
      assert(res.data.list.length > 0, '楼栋列表不能为空');
      var building = res.data.list[0];
      service.listRoom(cityId, building.projectId, building.id).then(function (res) {
        assert(res.code === 200, '服务器返回CODE异常');
        assert(_.isArray(res.data.list), '服务器返回列表数据异常');
        done();
      });
    });
  });

});