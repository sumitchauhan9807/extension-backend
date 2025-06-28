import { Router } from "express";
import { ResponseHandler } from "../../helpers";
import { translator ,streamTest ,test1  ,langTest} from "./controller";
import {translateValidator} from './validations'
const _ = require('lodash');

const apiRouter = Router();

apiRouter.post("/", (req,res,next) => {
  let response = new ResponseHandler()
  const validator = translateValidator.validate(req.body, { errors: { wrap: { label: '' } } });
  validator.error ? response.sendErroResponse(res,{status:422,json:{message:_.get(validator, ["error", "message"], "Validation Error")}}) : next();
},translator);

apiRouter.post("/lang-test",langTest);

apiRouter.get("/",test1)
// apiRouter.get("/",streamTest)


export default apiRouter;
