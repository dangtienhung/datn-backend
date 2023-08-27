import joi from 'joi';

export const orderValidate = joi.object({
  user: joi.string().required(),
  items: joi.array().items(
    joi.object({
      image: joi.string(),
      product: joi.string().required(),
      quantity: joi.number().required(),
      price: joi.number().required(),
      toppings: joi.array().items(
        joi.object({
          name: joi.string().required(),
          price: joi.number().required(),
        })
      ),
      size: joi.object({
        name: joi.string().required(),
        price: joi.number().required(),
        _id: joi.string().required(),
      }),
    })
  ),
  status: joi
    .string()
    .valid('pending', 'confirmed', 'delivered', 'done', 'canceled')
    .default('pending'),
  noteOrder: joi.string(),
  total: joi.number(),
  priceShipping: joi.number().default(0),
  paymentMethodId: joi.string().valid('cod', 'momo', 'zalopay').default('cod'),
  inforOrderShipping: joi
    .object({
      name: joi.string().required(),
      address: joi.string().required(),
      phone: joi.string().required(),
      noteShipping: joi.string(),
    })
    .required()
    .messages({
      'object.base': 'inforOrderShipping must be an object',
      'object.empty': 'inforOrderShipping must be an object',
      'any.required': 'inforOrderShipping is required',
    }),
  is_active: joi.boolean().valid(true, false).default(true),
});
