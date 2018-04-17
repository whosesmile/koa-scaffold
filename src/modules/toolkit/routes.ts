import * as service from './service';
import { Context } from 'koa';

export const example = async (ctx: Context) => {
  ctx.body = ctx.render('./templates/example.html');
};

export const upload = async (ctx: Context) => {
  const files = ctx.request.body.files;
  const group = Object.keys(files).reduce((list, name) => {
    return list.concat(files[name]);
  }, []);

  const list = await Promise.all(group.map(file => service.upload(file))).catch(e => {
    ctx.throw(e.status || 500, '七牛上传失败');
  });
  ctx.body = { code: 200, list };
};