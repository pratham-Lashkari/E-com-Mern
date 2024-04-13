import mongoose, { Schema } from "mongoose";
import validator from "validator"

const schema = new Schema(
{
   id : {
    type : String,
    required : [true , "Please enter id"]
   },
   name : {
    type : String,
    required : [true , "Please enter name"]
   },
   email :{
    type:String,
    unique : [true ,  "Already Exist"],
    required : [true , "Enter email"],
    validator : validator.default.isEmail
   },
   role :{
    type : String,
    enum : ["admin " , "user"],
    default : "user"
   },
   gender:{
    type : String,
    enum : ["male" , "female"],
    required :[true , "Enter gender"] ,
   },
   dob : {
    type : Date,
    required : [true , "Please enter date of birth"]
   }

}
,{
  timestamps : true,
})

export  const  User = mongoose.model("User" , schema);  