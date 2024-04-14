import { NextFunction, Request, Response } from "express";

export interface NewUsertype{
  _id : string;
  name : string;
  email : string;
  dob : Date;
  gender : string;
  photo : string;
  role : string;
}

export type ControllerType = (
  req: Request,
  res: Response,
  next: NextFunction
) => Promise<void | Response<any, Record<string, any>>> ;
