var models = require('../../config').models;
var Work = models.Work;

/**
 * 列举Work
 * @param  {string} path 文件路径
 * @return promise
 */
exports.query = function (page, size) {
  page = page || 1;
  size = size || 20;

  return Work.findAll({
    offset: size * (page - 1),
    limit: size
  });
};