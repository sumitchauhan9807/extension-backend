import { Router } from "express";

const _ = require('lodash');

const apiRouter = Router();

// apiRouter.post("/", (req,res,next) => {
//   console.log("heree")
//   const validator = translateValidator.validate(req.body, { errors: { wrap: { label: '' } } });
//   validator.error ? res.status(400).json({ message: _.get(validator, ["error", "message"], "Validation Error"), status: 0 }) : next();
// },translator);

// apiRouter.get("/",test1)
// apiRouter.get("/",streamTest)


export default apiRouter;
