import { Context } from 'koa';

export const home = async (ctx: Context) => {
  ctx.body = ctx.render('./templates/index.html', { count: 3 });
};
