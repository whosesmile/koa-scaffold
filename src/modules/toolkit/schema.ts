import Joi = require('joi');

// 限制<input name="file" />, 仅限单张上传图片类型 上限2MB
export const upload: Joi.SchemaMap = {
  body: {
    fields: Joi.object(),
    files: Joi.object({
      file: Joi.object({
        type: Joi.string().regex(/^image\//, 'image'),
        size: Joi.number().greater(0).less(1024 * 1024 * 2),
      }).unknown(true),
    }),
  },
};
