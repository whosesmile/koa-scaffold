import { Context } from 'koa';
import { minify } from 'html-minifier';

const options = {
  minifyJS: { mangle: false },
  minifyCSS: true,
  collapseWhitespace: true,
  keepClosingSlash: true,
  removeComments: true,
  processScripts: [],
};

export default async function (ctx: Context, next: () => Promise<any>) {
  // env is string
  if (process.env.HTML_MINIFY !== 'true') {
    return next();
  }

  await next();

  if (!ctx.response.is('html')) {
    return;
  }

  let body = ctx.body;

  if (!body || typeof body === 'object' || typeof body.pipe === 'function') {
    return;
  }
  if (Buffer.isBuffer(body)) {
    body = body.toString('utf8');
  }
  ctx.body = minify(body, options);
}
