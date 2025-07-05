import { Router } from "express";

const _ = require('lodash');
const fileUpload = require('express-fileupload');
const apiRouter = Router();
import  {getUserChats, tess}  from "./controller";
import { loginValidator , getTeamReplyValidator } from "./validations";

// apiRouter.post("/", (req,res,next) => {
//   console.log("heree")
//   const validator = translateValidator.validate(req.body, { errors: { wrap: { label: '' } } });
//   validator.error ? res.status(400).json({ message: _.get(validator, ["error", "message"], "Validation Error"), status: 0 }) : next();
// },translator);

// apiRouter.get("/",test1)
// apiRouter.get("/",streamTest)

apiRouter.get('/chats',getUserChats)
apiRouter.post('/tess',fileUpload(),(req,res,next) => {
  const validator = getTeamReplyValidator.validate(req.body, { errors: { wrap: { label: '' } } });
  validator.error ? res.status(400).json({ message: _.get(validator, ["error", "message"], "Validation Error"), status: 0 }) : next();
},tess)

export default apiRouter;
