import { Context } from 'koa';
import cobody = require('co-body');

// default text types
const textTypes = [
  'text/plain',
];

// default form types
const formTypes = [
  'application/x-www-form-urlencoded',
];

// default json types
const jsonTypes = [
  'application/json',
  'application/csp-report',
  'application/vnd.api+json',
  'application/json-patch+json',
];

// 检查请求类型解析
function checkEnable(types: string[], type: string) {
  return types.indexOf(type) >= 0;
}

// 中间件构造函数
const enableType = ['json', 'form'];
const enableForm = checkEnable(enableType, 'form');
const enableJson = checkEnable(enableType, 'json');
const enableText = checkEnable(enableType, 'text');

// 仅解析支持的请求类型
async function parseBody(ctx: Context) {
  if (enableJson && ctx.request.is(jsonTypes)) {
    return cobody.json(ctx);
  }
  if (enableForm && ctx.request.is(formTypes)) {
    return cobody.form(ctx);
  }
  if (enableText && ctx.request.is(textTypes)) {
    return cobody.text(ctx) || '';
  }
  return {};
}

// 返回异步函数做中间件
export default async (ctx: Context, next: () => Promise<any>) => {
  if (ctx.request.body !== undefined) {
    return next();
  }
  ctx.request.body = await parseBody(ctx);
  return next();
};