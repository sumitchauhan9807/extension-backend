import { Router } from "express";
import jsonwebtoken from 'jsonwebtoken'
import {User} from '../models'
import {ResponseHandler} from '../helpers'
const adminAuthRoute = Router()
//user authentication and redirection
adminAuthRoute.use(async (req, res, next) => {
  const response = new ResponseHandler()
  try {
    // check token from header
    let token = req.headers["authorization"]
      ? req.headers["authorization"].substring(7)
      : "";
    // decode token
    if (!token) {
      return response.sendErroResponse(res,{status:422,json:{message:"Auth token required"}})
    } else if (token) {
      // verifies secret and checks exp
      jsonwebtoken.verify(
        token,
        'kasjdkas$%^$%&%^&jhasdjgi8237498hjsakdhfjk2893ruidkdhfjk',
        {
          ignoreExpiration: true,
        },
        async (err, decoded:any) => {
          if (err) {
            return response.sendErroResponse(res,{status:422,json:{message:"User Authentication failed"}})
          }
          req.userContext = await User.findOne({
            where : {id:decoded.id}
          })
          return next();
        }
      );
    }
  } catch (err) {
    return next(err);
  }
});

export default adminAuthRoute
