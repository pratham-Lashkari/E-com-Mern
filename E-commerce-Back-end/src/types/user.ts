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
export interface NewProducttype{
  name : string;
  category : string;
  price : number;
  photo : string;
  stock : number;
}


export type ControllerType = (
  req: Request,
  res: Response,
  next: NextFunction
) => Promise<void | Response<any, Record<string, any>>> ;
