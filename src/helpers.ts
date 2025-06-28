import { Express, Request, Response, NextFunction } from "express";
import {PROFILE_TYPES} from './types'
interface errorInput {
  status: 200 | 404 | 422 | 500;
  json: {
    message: string;
  };
}
export interface SuccessResponseType {
  json: {
    message: string;
    data: any;
  };
}
export interface LoginSuccessResponseType {
  json: {
    message: string;
    data: any;
    token:string,
    role:PROFILE_TYPES
  };
}
export class ResponseHandler {
  sendErroResponse(res: Response, responseMeta: errorInput) {
    res.status(responseMeta.status).json(responseMeta.json);
  }
  sendSuccessResponse(res: Response, responseMeta: SuccessResponseType) {
    res.status(200).json(responseMeta.json);
  }
  sendLoginSuccessResponse(res: Response, responseMeta: LoginSuccessResponseType) {
    res.status(200).json(responseMeta.json);
  }
}
