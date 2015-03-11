var path = require('path');
var upyun = require('upyun-legacy');

// 初始化图片服务器
var imageStorage = new upyun('image-assets', 'smilelegend', 'idontknow123456', 'v0');

// 计算目标路径
function dest(name, file) {
  var date = new Date();
  var year = String(date.getFullYear());
  var month = String(date.getMonth() + 1);
  if (month.length === 1) {
    month = '0' + month;
  }
  return path.join('/', year, month, path.basename(file) + path.extname(name));
}

module.exports = {
  // 上传图片
  uploadImage: function (name, type, image) {
    return new Promise(function (resolve, reject) {
      imageStorage.uploadFile(dest(name, image), image, type, true, function (err, data) {
        if (err) {
          console.error(err);
          return reject(err);
        }
        if (data.statusCode === 200) {
          return resolve('http://image-assets.b0.upaiyun.com' + dest(name, image));
        }
        console.error(data);
        return reject(data);
      });
    });
  }
};