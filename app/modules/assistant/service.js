var config = require('../../config');
var whost = config.whost;
var request = require('../../support').request;
/**
 * 列举公告信息
 * @param  {number} projectId 社区主键
 * @param  {number} type      1管家首页 2 千丁首页
 * @param  {number} page
 * @param  {number} size
 * @return {promise}
 */
exports.listNotice = function (projectId, type, page, size) {
  return request({
    url: whost + '/hk/notice/list',
    method: 'get',
    qs: {
      projectId: projectId,
      position: type || 1,
      page: page || 1,
      size: size || 10
    }
  });
};
/**
 * 获取公告详情 noticeType: 1紧急通知 2通知 3社区活动
 * @param  {number} id 公告主键
 * @return {promise}
 */
exports.getNotice = function (id) {
  return request({
    url: whost + '/hk/notice/info',
    method: 'get',
    qs: {
      id: id
    }
  }).then(function (data) {
    return {
      notice: data.obj
    };
  });
};