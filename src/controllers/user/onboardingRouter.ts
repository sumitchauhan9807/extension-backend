import { Router } from "express";
import { login } from "./controller";
import {loginValidator} from './validations'
const _ = require('lodash');

const userOnboarding = Router();

userOnboarding.post("/login", (req,res,next) => {
  const validator = loginValidator.validate(req.body, { errors: { wrap: { label: '' } } });
  validator.error ? res.status(400).json({ message: _.get(validator, ["error", "message"], "Validation Error"), status: 0 }) : next();
},login);



export default userOnboarding;
