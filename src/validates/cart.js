import joi from 'joi';

export const cartValidate = joi.object({
  user: joi.string().required(),
  products: joi.array().items(
    joi.object({
      product: joi.string().required(),
      quantity: joi.number().required(),
      price: joi.number().required(),
      toppingOrder: joi.string(),
    })
  ),
});
