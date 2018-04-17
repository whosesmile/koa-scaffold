import { unlink } from 'fs';
import qiniu = require('qiniu');
import logger from '../../utils/logger';

type ConfigOptions = qiniu.conf.ConfigOptions | {
  zone?: qiniu.conf.Zone;
};

const mac = new qiniu.auth.digest.Mac(process.env.QINIU_ACCESS_KEY, process.env.QINIU_SECRET_KEY);
const policy = new qiniu.rs.PutPolicy({ scope: process.env.QINIU_BUCKET });
const token = policy.uploadToken(mac);
const config: ConfigOptions = new qiniu.conf.Config();
config.zone = qiniu.zone.Zone_z0;
const extra = new qiniu.form_up.PutExtra();
const uploader = new qiniu.form_up.FormUploader(config);

export async function upload(file: any) {
  return new Promise((resolve, reject) => {
    // 将KEY设置为null 利用七牛自带的etag/hash算法做消重: https://github.com/qiniu/qetag
    uploader.putFile(token, null, file.path, extra, (err, body, info) => {
      if (err) { throw err; }
      if (info.statusCode !== 200) { throw info; }
      unlink(file.path, n => n);
      logger.info('upload success:', file.toJSON());
      resolve(process.env.QINIU_DOMAIN + body.key);
    });
  });
}
