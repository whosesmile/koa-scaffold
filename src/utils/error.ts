import { Context } from 'koa';
import { STATUS_CODES } from 'http';
import logger from './logger';

const types = ['html', 'text', 'json'];
export default async (ctx: Context, next: () => Promise<any>) => {
  try {
    await next();
    if (ctx.response.status === 404 && !ctx.response.body) {
      ctx.throw(404);
    }
  } catch (err) {
    ctx.status = typeof err.status === 'number' ? err.status : 500;
    // (<any> ctx.app).emit('error', err, ctx);

    // 检查
    const type = ctx.accepts(types);
    // text
    if (type === 'text') {
      ctx.type = 'text/plain';
      if (process.env.NODE_ENV !== 'production') {
        ctx.body = err.message;
      }
      else if (err.expose) {
        ctx.body = err.message;
      }
      else {
        ctx.body = STATUS_CODES[ctx.status];
      }
    }
    // json
    else if (type === 'json') {
      ctx.type = 'application/json';
      if (process.env.NODE_ENV !== 'production') {
        ctx.body = { code: ctx.status, error: err.message, stack: err.stack };
      }
      else if (err.expose) {
        ctx.body = { code: ctx.status, error: err.message };
      }
      else {
        ctx.body = { code: ctx.status, error: STATUS_CODES[ctx.status] };
      }
    }
    // html
    else if (type === 'html') {
      ctx.type = 'text/html';
      ctx.body = ctx.render('../templates/error.html', {
        error: err,
        status: ctx.status,
        env: process.env.NODE_ENV,
      });
    }

    // 错误日志
    logger.error(`status: ${err.status}\nmessage: ${err.message}\nstack: ${err.stack}`);
  }
};