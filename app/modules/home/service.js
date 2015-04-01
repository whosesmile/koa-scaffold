var config = require('../../config');
var whost = config.whost;
var request = require('../../support').request;

/**
 * 获取首页数据
 * @param  {number} projectId 项目主键
 * @return promise
 */
exports.home = function (projectId) {
  return request({
    url: whost + '/qding-api/api/json/hotcycle/getCommunityIndex',
    method: 'get',
    qs: {
      body: JSON.stringify({
        "appDevice": {
          "qdDevice": "browser",
          "qdPlatform": "HTML5",
          "qdVersion": config.api.version
        },
        "communityId": projectId,
        "version1": config.api.version,
        "code": "home"
      })
    }
  });
};