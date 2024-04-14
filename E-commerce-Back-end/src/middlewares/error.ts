import { NextFunction , Request , Response } from "express";
import ErrorHandler from "../utils/utitlity-class.js";
import { ControllerType } from "../types/user.js";

export const errorMiddleweare =(
  err : ErrorHandler , 
  req : Request, 
  res :Response, 
  next : NextFunction)=>{
   const message =  err.message || "Internal sever error";
   const statusCode =  err.statusCode ||500;
      return res.status(statusCode).json({
        success : false,
        message 
      });
}

 export const TryCatch = (func : ControllerType) => ( req:Request , res:Response , next:NextFunction)=>{

    return Promise.resolve(func(req,res,next)).catch(next);
 };