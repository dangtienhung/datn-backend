import joi from 'joi';

const SizeValidate = joi.object({
  name: joi.string().required({
    'string.empty': 'size is not allowed to be empty',
    'any.required': 'size is required',
  }),
});

export default SizeValidate;
