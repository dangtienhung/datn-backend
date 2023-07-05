import joi from 'joi';
const RoleValidate = joi.object({
  name: joi.string().required({
    'string.base': 'Name must be a string',
    'string.base': 'Name is not allowed to be empty',
    'any.required': 'Name is required',
  }),
  users: joi.array().items(joi.string()),
});

export default RoleValidate;
