import fs = require('fs');
import path = require('path');
import { Context } from 'koa';

// 预载并缓存
const ICON = fs.readFileSync(path.resolve(__dirname, '../favicon.ico'));
const CACHE = `public, max-age=${86400}`; // 一天

export default (ctx: Context, next: () => Promise<any>) => {
  if ('/favicon.ico' !== ctx.path) {
    return next();
  }

  if ('GET' !== ctx.method && 'HEAD' !== ctx.method) {
    ctx.set('Allow', 'GET, HEAD, OPTIONS');
    ctx.status = ctx.method === 'OPTIONS' ? 200 : 405;
  }
  else {
    ctx.set('Cache-Control', CACHE);
    ctx.type = 'image/x-icon';
    ctx.body = ICON;
  }
};
