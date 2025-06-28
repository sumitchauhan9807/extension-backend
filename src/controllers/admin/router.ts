import { ResponseHandler } from "../../helpers";
import { Router } from "express";
import  adminController  from "./controller";
import {createUserValidator,changePassword,updateUserLang,updateOperationLang} from './validations'
const _ = require('lodash');
const adminRouter = Router();

adminRouter.post("/create-user", (req,res,next) => {
  let response = new ResponseHandler()
  const validator = createUserValidator.validate(req.body, { errors: { wrap: { label: '' } } });
  validator.error ? response.sendErroResponse(res,{status:422,json:{message:_.get(validator, ["error", "message"], "Validation Error")}}) : next();
},adminController.createUser);

adminRouter.delete("/user/:id",adminController.deleteUser);
adminRouter.patch("/user-password/:id",(req,res,next) => {
  let response = new ResponseHandler()
  const validator = changePassword.validate(req.body, { errors: { wrap: { label: '' } } });
  validator.error ? response.sendErroResponse(res,{status:422,json:{message:_.get(validator, ["error", "message"], "Validation Error")}}) : next();
},adminController.changeUserPassword);


adminRouter.get('/users',adminController.getAllUsers)
adminRouter.patch('/lang/:id',(req,res,next) => {
  let response = new ResponseHandler()
  const validator = updateUserLang.validate(req.body, { errors: { wrap: { label: '' } } });
  validator.error ? response.sendErroResponse(res,{status:422,json:{message:_.get(validator, ["error", "message"], "Validation Error")}}) : next();
},adminController.updateUserLang)

adminRouter.patch('/operation-langs/:id',(req,res,next) => {
  let response = new ResponseHandler()
  const validator = updateOperationLang.validate(req.body, { errors: { wrap: { label: '' } } });
  validator.error ? response.sendErroResponse(res,{status:422,json:{message:_.get(validator, ["error", "message"], "Validation Error")}}) : next();
},adminController.updateOperationLang)

adminRouter.post('/createAdmin',adminController.createAdmin)





export default adminRouter;
