import { User } from "../models/user.js";
import ErrorHandler from "../utils/utitlity-class.js";
import { TryCatch } from "./error.js";

// Admin midddleware 
export const adminOnly =TryCatch( async(req,res,next)=>{
   const {id} = req.query;

   if(!id)
    {
      return next(new ErrorHandler("Please enter id: " , 404));
    }
   
   const user  = await User.findById(id);

   if(!user)
    {
      return next(new ErrorHandler("Not found any user" , 404));
    }
   
    if(user.role.includes("admin"))
      {
        next();
      }
      else{
        return next(new ErrorHandler("Only admin can access it , " , 401));

      }
})