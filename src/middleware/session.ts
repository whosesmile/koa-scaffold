import Koa = require('koa');
import session = require('koa-session');
import logger from '../utils/logger';
import RedisStore from './store';

// const CONFIG = {
//   key: 'koa:sess', /** (string) cookie key (default is koa:sess) */
//   /** (number || 'session') maxAge in ms (default is 1 days) */
//   /** 'session' will result in a cookie that expires when session/browser is closed */
//   /** Warning: If a session cookie is stolen, this cookie will never expire */
//   maxAge: 86400000,
//   overwrite: true, /** (boolean) can overwrite or not (default true) */
//   httpOnly: true, /** (boolean) httpOnly or not (default true) */
//   signed: true, /** (boolean) signed or not (default true) */
//   rolling: false, /** (boolean) Force a session identifier cookie to be set on every response. The expiration is reset to the original maxAge, resetting the expiration countdown. (default is false) */
//   renew: false, /** (boolean) renew session when session is nearly expired, so we can always keep user logged in. (default is false)*/
// };

// SESSION配置 参考上文注释
const CONFIG: Partial<session.opts> = {
  key: 'T',
  maxAge: 86400000 * 7, // 7天
  renew: true,
};

// 检查是否配置REDIS
if (process.env.REDIS_PORT && process.env.REDIS_HOST) {
  const host = process.env.REDIS_HOST;
  const port = Number(process.env.REDIS_PORT);
  CONFIG.store = new RedisStore({ host, port });

  // 替换默认的genid算法，300ms太慢
  let p = (len = 6) => (Math.random().toString(16) + '000000000').substr(2, len);
  CONFIG.genid = () => 'NS:' + p() + p() + p() + p();
}

logger.info(`${CONFIG.store ? 'redis' : 'cookie'} session is enabled`);

// 部分资源可能不需要SESSION, 譬如favicon、css、js等, 所以这里做一个黑名单列表
const BLACKLIST = [
  '/favicon.ico',
  process.env.STATIC_PREFIX!,
];

export default function (app: Koa) {
  // 秘钥随机生成办法
  // require('crypto').randomBytes(32, (err, buf) => {
  //   console.log(`${buf.length} bytes of random data: ${buf.toString('base64')}`);
  // });
  app.keys = JSON.parse(process.env.SECRET_KEYS!);

  // 创建SESSION中间件
  const middleware = session(CONFIG, app);

  return async (ctx: Koa.Context, next: () => Promise<any>) => {
    if (ctx.path !== '/' && BLACKLIST.some(path => path.startsWith(ctx.path))) {
      logger.debug(`session is ignored for "${ctx.path}"`);
      return next();
    }
    await middleware(ctx, next);
    logger.debug(ctx.session ? `session is ${ctx.session.isNew ? 'created' : 'recovered'}` : 'session is destroyed');
  };
}
