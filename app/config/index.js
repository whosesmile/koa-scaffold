var path = require('path');
var storage = require('./storage');
var starter = require('./starter');

module.exports = {

  // 服务端口
  port: 9000,

  // 挂接平台
  platform: 'app',

  // 模板是否缓存
  templateCache: false,

  // 上传文件路径
  upload: path.resolve(__dirname, '../../node_upload/'),

  // 静态域名地址
  // shost: 'http://devfront.qdingnet.com',

  // shost: 'http://10.37.63.22',
  shost: 'http://127.0.0.1',

  // shost: 'http://192.168.0.102',

  // Web接口域名
  whost: 'http://devboss.qdingnet.com',

  // favicon路径
  favicon: path.resolve(__dirname, '../favicon.ico'),

  // 腾讯地图
  mapkey: 'KROBZ-3HZHV-LPYPF-UHQKQ-KLQ4O-HGFNQ',

  // 又拍云
  storage: storage,

  // 启动器
  init: function () {
    return starter(this.templateCache, this.shost, this.whost);
  }
};