import joi from 'joi';
const RoleValidate = joi.object({
  name: joi.string().required({
    'string.base': 'Name is not allowed to be empty',
    'any.required': 'Name is required',
  }),
});

export default RoleValidate;
