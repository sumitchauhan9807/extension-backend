import Joi from "joi";

const loginValidator = Joi.object({
  username: Joi.string().required(),
  password: Joi.string().required(),
});

const createUserValidator = Joi.object({
  username: Joi.string().required(),
  password: Joi.string().required(),
  name: Joi.string().required(),
  email: Joi.string().email().required(),
});

const changePassword = Joi.object({
  password: Joi.string().required(),
});

const updateUserLang = Joi.object({
  lang: Joi.string().required(),
});

const updateOperationLang = Joi.object({
  lang: Joi.string().required(),
  operation: Joi.string().required(),
});

export { loginValidator, createUserValidator, changePassword ,updateUserLang ,updateOperationLang };
