import Joi from "joi";


const loginValidator = Joi.object({
  username: Joi.string().required(),
  password: Joi.string().required(),
});

const getTeamReplyValidator = Joi.object({
  chatId: Joi.number().required(),
  oldResponse:Joi.string().optional(),
  retryText:Joi.string().optional()
});

export { loginValidator ,getTeamReplyValidator };
