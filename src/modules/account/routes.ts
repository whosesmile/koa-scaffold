import { Context } from 'koa';

export const account = async (ctx: Context) => {
  ctx.body = 'I am account';
};

export const settings = async (ctx: Context) => {
  (ctx.session as any) = null;
  ctx.body = 'I am settings';
};
