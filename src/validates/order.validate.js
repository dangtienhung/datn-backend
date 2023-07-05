import joi from 'joi';

export const orderValidate = joi.object({
  user: joi.string().required(),
  items: joi.array().items({
    product: joi.string().required(),
    quantity: joi.number().required(),
    price: joi.number().required(),
  }),
});
