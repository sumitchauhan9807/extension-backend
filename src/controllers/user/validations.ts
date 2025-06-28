import Joi from "joi";


const loginValidator = Joi.object({
  username: Joi.string().required(),
  password: Joi.string().required(),
});

export { loginValidator };
