import { ResponseHandler } from "../../helpers";
import { Router } from "express";
import  adminController  from "./controller";
import {loginValidator} from './validations'
const _ = require('lodash');

const adminOnboarding = Router();

adminOnboarding.post("/login", (req,res,next) => {
  let response = new ResponseHandler()
  const validator = loginValidator.validate(req.body, { errors: { wrap: { label: '' } } });
  validator.error ? response.sendErroResponse(res,{status:422,json:{message:_.get(validator, ["error", "message"], "Validation Error")}}) : next();
},adminController.login);
//res.status(400).json({ message: _.get(validator, ["error", "message"], "Validation Error"), status: 0 })
adminOnboarding.post("/create-admin",adminController.createAdmin);



export default adminOnboarding;
