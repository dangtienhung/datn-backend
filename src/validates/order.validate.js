import joi from 'joi';

export const orderValidate = joi.object({
  user: joi.string().required(),
  items: joi.array().items({
    product: joi.string().required(),
    quantity: joi.number().required(),
    price: joi.number().required(),
  }),
  status: joi.string().valid('pending', 'confirmed', 'delivered', 'done', 'canceled'),
  total: joi.number(),
  priceShipping: joi.number(),
  address: joi.string().required(),
  is_active: joi.boolean().default(true).valid(true, false),
});
