import joi from 'joi';

export const voucherValidate = joi.object({
  title: joi.string().required().messages({
    'any.required': 'title is required',
    'string.empty': 'title is not allowed to be empty',
    'string.unique': 'title is unique',
  }),
  discount: joi.number().required(),
  sale: joi.number().required(),
  startDate: joi.date().default(Date.now),
  endDate: joi.date().default(Date.now + 7),
  isActive: joi.boolean().default(true).messages({
    'any.required': 'isActive is required',
  }),
});
