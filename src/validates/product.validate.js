import joi from 'joi';

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
  // price: joi.number().required({
  //   'number.base': 'Price must be a string',
  //   'any.required:': 'Price is required',
  // }),
  category: joi.string().required(),
  toppings: joi.array().items(joi.string()).required(),
  is_deleted: joi.boolean().default(false),
  is_active: joi.boolean().default(true),
  images: joi
    .array()
    .items(
      joi
        .object({
          url: joi.string(),
          publicId: joi.string(),
          filename: joi.string(),
        })
        .unknown(true)
    )
    .min(1),
  sale: joi.object({
    value: joi.number().required(),
    isPercent: joi.boolean().default(false),
  }),
  sizes: joi.array().items(joi.string()).required(),
  // sizes: joi
  //   .array()
  //   .items(
  //     joi.object({
  //       name: joi.string().required(),
  //       price: joi.number().required(),
  //     })
  //   )
  //   .required()
  //   .messages({
  //     'any.required': 'Sizes is required',
  //   }),
  // sizes: joi.array().items(
  //   joi
  //     .object({
  //       name: joi.string(),
  //       price: joi.number(),
  //     })
  //     .unknown(true)
  // ),
});

export default productValidate;
