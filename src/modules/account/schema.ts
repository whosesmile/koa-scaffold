import Joi = require('joi');

export const account: Joi.SchemaMap = {
  body: {},
  params: {
    name: Joi.string(),
  },
  query: {
    age: Joi.number(),
  },
};

export const settings: Joi.SchemaMap = {
  body: {},
  params: {},
  query: {},
};
