var path = require('path');
var storage = require('./storage');
var starter = require('./starter');
var models = require('./db');

module.exports = {

  // 服务端口
  port: 9798,

  // 挂接平台
  platform: 'weixin',

  // 模板是否缓存
  templateCache: false,

  // 静态域名地址
  shost: 'http://front.qdingnet.com',
  // shost: 'http://devfront.qdingnet.com',
  // shost: 'http://10.37.63.8',

  // Web接口域名
  // whost: 'http://boss.qdingnet.com',
  whost: 'http://devboss.qdingnet.com',

  // favicon路径
  favicon: path.resolve(__dirname, '../favicon.ico'),

  // 腾讯地图
  mapkey: 'KROBZ-3HZHV-LPYPF-UHQKQ-KLQ4O-HGFNQ',

  // 又拍云
  storage: storage,

  // 接口信息
  api: {
    version: '1.2.0'
  },

  models: models,

  // 启动器
  init: function () {
    return starter(this.templateCache, this.shost, this.whost);
  }
};