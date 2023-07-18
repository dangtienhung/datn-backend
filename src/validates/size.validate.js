import joi from 'joi';

const SizeValidate = joi.object({
  name: joi.string().required({
    'string.empty': 'size is not allowed to be empty',
    'any.required': 'size is required',
  }),
  price: joi.number().required().messages({
    'number.base': 'price must be a number',
    'number.empty': 'price is not allowed to be empty',
  }),
});

export default SizeValidate;
