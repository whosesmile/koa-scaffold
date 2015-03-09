// var database = require('./database');

var path = require('path');

module.exports = {

  // 服务端口
  port: 9000,

  // 模板是否缓存
  templateCache: false,

  // 上传文件路径
  upload: path.resolve(__dirname, '../../node_upload/'),

  // 静态域名地址
  shost: 'http://devfront.qdingnet.com',

  // Web接口域名
  whost: 'http://devboss.qdingnet.com',

  // favicon路径
  favicon: path.resolve(__dirname, '../favicon.ico'),

  mapkey: 'KROBZ-3HZHV-LPYPF-UHQKQ-KLQ4O-HGFNQ'

};