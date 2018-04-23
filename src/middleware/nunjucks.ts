import path = require('path');
import moment = require('moment');
import { Context } from 'koa';
import { Environment, FileSystemLoader } from 'nunjucks';

function callsite(): any {
  const orig = Error.prepareStackTrace;
  Error.prepareStackTrace = (_, traces) => traces;
  const err = new Error();
  Error.captureStackTrace(err, callsite);
  const stack = err.stack;
  Error.prepareStackTrace = orig;
  return stack;
}

const REG_HTML = /(<([^>]+)>)/gi;
const REG_ATTR = /\s?(style|class|width|height)=".+?"/g;
const REG_SCRIPT = /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi;

const env = new Environment(new FileSystemLoader('.', {
  noCache: process.env.NODE_ENV !== 'production',
}));

// remove HTML tags
env.addFilter('rmhtml', (content: string) => content.replace(REG_HTML, ''));

// remove HTML attr
env.addFilter('rmattr', (content: string) => content.replace(REG_ATTR, ''));

// remove SCRIPT tag
env.addFilter('rmxss', (content: string) => content.replace(REG_SCRIPT, ''));

// moment format date
env.addFilter('date', (time: any, format: string) => time && moment(time).format(format));

export default function (ctx: Context, next: () => Promise<any>) {
  // TODO: maybe add some request thread varibel
  ctx.render = (name: string, context?: any) => {
    // 本地路径 (相对调用目录)
    if (!name.startsWith('/')) {
      name = path.resolve(callsite()[1].getFileName(), '../', name);
    }
    return env.render(name, context);
  };
  return next();
}
