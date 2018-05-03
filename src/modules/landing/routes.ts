import { Context } from 'koa';

export const home = async (ctx: Context) => {
  ctx.session!.number = (ctx.session!.number || 0) + 1;
  ctx.body = ctx.render('./templates/index.html', { count: 3 });
};

// json demo
export const hello = async (ctx: Context) => {
  ctx.body = { code: 200, message: 'Hello Everybody!' };
};
