import { NextFunction , Request , Response } from "express";
import { NewUsertype } from "../types/user.js";
import { User } from "../models/user.js";
import ErrorHandler from "../utils/utitlity-class.js";

export const newUser =  async( 
  req : Request<{},{},NewUsertype> , 
  res :Response , 
  next:NextFunction)=>{
   return next( new ErrorHandler("Controler ka eeroor" , 400));
   try {
    const {_id ,name ,email ,dob ,gender ,photo  } = req.body;
    console.log(_id , name , email , gender , dob , photo);

    const user = await User.create({
      _id ,
      name ,
      email ,
      dob : new Date(dob) ,
      gender ,
      photo 
    })

     return res.status(200).send({
      success : true,
      message : `Welcome ${name}`

    })
   } catch (error) {
    return res.status(404).send({
      success : false,
      message : `kya kar rahi hai vaishali`,
      error
    })
   }
}