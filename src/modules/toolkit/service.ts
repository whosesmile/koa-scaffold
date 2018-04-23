import { unlink } from 'fs';
import qiniu = require('qiniu');
import logger from '../../utils/logger';

const mac = new qiniu.auth.digest.Mac(process.env.QINIU_ACCESS_KEY, process.env.QINIU_SECRET_KEY);
const policy = new qiniu.rs.PutPolicy({
  scope: process.env.QINIU_BUCKET,
});
const config: any = new qiniu.conf.Config();
config.zone = qiniu.zone.Zone_z0;
const extra = new qiniu.form_up.PutExtra();
const uploader = new qiniu.form_up.FormUploader(config);

export async function upload(file: any) {
  // 防止令牌过期 每次都重新生成

  return new Promise((resolve, reject) => {
    // 将KEY设置为null 利用七牛自带的etag/hash算法做消重: https://github.com/qiniu/qetag
    const token = policy.uploadToken(mac);
    uploader.putFile(token, null, file.path, extra, (err, body, info) => {
      unlink(file.path, e => e); // 移除硬盘上缓存文件
      if (err) {
        logger.error(err.message, err.stack);
        return reject(err);
      }
      if (info.statusCode !== 200) {
        logger.error(info);
        return reject(info);
      }
      logger.info('upload success:', file.toJSON());
      resolve(process.env.QINIU_DOMAIN + body.key);
    });
  });
}