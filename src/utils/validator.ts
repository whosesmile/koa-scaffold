import Joi = require('joi');
import { Context } from 'koa';

const options: Joi.ValidationOptions = {
  convert: true,
  allowUnknown: false,
  presence: 'required',
};

function validator(opts: Joi.SchemaMap) {
  // 提供默认空白对象值
  opts = { body: {}, query: {}, params: {}, ...opts };
  const schema = Joi.object().keys(opts);
  return (ctx: Context, next: () => Promise<any>) => {
    const { params, request: { body, query } } = ctx;
    const { error, value } = schema.validate({ body, query, params }, options);
    if (error) {
      return ctx.throw(422, '参数不合法');
    }
    ctx.params = value.params;
    ctx.request.body = value.body;
    ctx.request.query = value.query;
    return next();
  };
}

export default validator;