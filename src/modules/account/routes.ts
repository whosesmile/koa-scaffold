import { Context } from 'koa';

export const account = async (ctx: Context) => {
  ctx.body = 'I am account';
};

export const settings = async (ctx: Context) => {
  (<any> ctx.session) = null;
  ctx.body = 'I am settings';
};