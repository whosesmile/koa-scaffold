import { Context } from 'koa';
import send = require('koa-send');

const options = {
  root: '.',
  maxage: 365 * 24 * 60 * 60,
};

// 防止每次重复定义的性能损失
const REGEX_PREFIX = new RegExp('^' + process.env.STATIC_PREFIX);

export default function (ctx: Context, next: () => Promise<any>) {
  if (ctx.path.startsWith(process.env.STATIC_PREFIX!)) {
    // prefix可变, 但按约定静态目录为static文件夹内, 所以此处做替换
    const path = ctx.path.replace(REGEX_PREFIX, '/static/');
    return send(ctx, path, options);
  }
  return next();
}
