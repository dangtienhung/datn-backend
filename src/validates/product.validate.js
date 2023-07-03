import joi from 'joi';
import mongoose from 'mongoose';

const productValidate = joi.object({
  name: joi.string().required({
    'string.base': 'Name must be a string',
    'string.empty': 'Name is not allowed to be empty ',
    'any.required': 'Name is required',
  }),
  description: joi.string().required({
    'string.empty': 'Description is not allowed to be empty',
    'any.required': 'Description is required',
  }),
  image: joi.string().required(),
  price: joi.number().required({
    'number.base': 'Price must be a string',
    'any.required:': 'Price is required',
  }),
  category: joi.string().required(),
  size: joi.array().items(joi.string()),
  topping: joi.array().items(joi.string()),
  is_deleted: joi.boolean(),
});

export default productValidate;
