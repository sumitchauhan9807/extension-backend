import Joi from "joi";


const loginValidator = Joi.object({
  username: Joi.string().required(),
  password: Joi.string().required(),
});

const getTeamReplyValidator = Joi.object({
  chatId: Joi.number().required(),
});

export { loginValidator ,getTeamReplyValidator };
