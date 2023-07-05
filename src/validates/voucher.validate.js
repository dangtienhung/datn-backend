import joi from 'joi';

export const voucherValidate = joi.object({
  code: joi.string().required().messages({
    'any.required': 'code is required',
    'string.empty': 'code is not allowed to be empty',
    'string.unique': 'code is unique',
  }),
  discount: joi.number().required(),
  sale: joi.number().required(),
  startDate: joi.date().default(Date.now),
  endDate: joi.date().default(Date.now + 7),
  isActive: joi.boolean().default(true).messages({
    'any.required': 'isActive is required',
  }),
});
