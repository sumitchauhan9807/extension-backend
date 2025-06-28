import Joi from "joi";

const translateValidator = Joi.object({
  text: Joi.string().required(),
  language: Joi.string().valid('hindi','german','english','french','US american english').default('english'),
  operation:Joi.string().valid('TRANSLATE','RE_PHRASE').required(),
});

export { translateValidator };
