import joi from 'joi';

export const bannerValidate = joi.object({
  url: joi.string().required().messages({
    'string.base': 'url must be a string',
    'string.empty': 'url is not allowed to be empty',
    'any.required': 'url is required',
  }),
  publicId: joi.string().required().messages({
    'string.base': 'publicId must be a string',
    'string.empty': 'publicId is not allowed to be empty',
    'any.required': 'publicId is required',
  }),
});
