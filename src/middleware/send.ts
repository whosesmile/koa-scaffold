import { Context } from 'koa';
import send = require('koa-send');

const options = {
  root: '.',
  maxage: 365 * 24 * 60 * 60,
};

export default function (ctx: Context, next: () => Promise<any>) {
  if (ctx.path.startsWith(process.env.STATIC_PREFIX!)) {
    return send(ctx, ctx.path, options);
  }
  return next();
}