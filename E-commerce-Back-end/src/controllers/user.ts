import { NextFunction , Request , Response } from "express";
import { NewUsertype } from "../types/user.js";
import { User } from "../models/user.js";
import ErrorHandler from "../utils/utitlity-class.js";
import { TryCatch } from "../middlewares/error.js";

export const newUser = TryCatch(
  async( 
    req : Request<{},{},NewUsertype> , 
    res :Response , 
    next:NextFunction)=>{

      const {_id ,name ,email ,dob ,gender ,photo  } = req.body;
     
       let user = await User.findById(_id);

       if(user)
        {
          return res.status(200).send({
            success : true,
            message : `Welcome ${user.name}`
          })
        }
        if (!name || !_id || !email || !gender || !dob || !photo) {
            return next(new ErrorHandler("Please enter all details ",400));
        }
        

       user = await User.create({
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

});

export const getAllUser =TryCatch( async(req,res,next)=>{

   let users = await User.find({});

   return res.status(201).send({
    users
   })
});


export const getUser =TryCatch( async(req,res,next)=>{

   const id = req.params.id;
  let user = await User.findById(id);
 
  if(!user)
    {
      return next(new ErrorHandler("Invalid id" , 400));
    }
  return res.status(201).send({
    success : true,
   user
  })
});

export const deleteUser =TryCatch( async(req,res,next)=>{

  const id = req.params.id;
 let user = await User.findById(id);

 if(!user)
   {
     return next(new ErrorHandler("Invalid id" , 400));
   }

  await user.deleteOne()
 return res.status(201).send({
   success : true,
  message : "User Deleted Successfully"
 })
});



