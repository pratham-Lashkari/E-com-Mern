import mongoose, { Schema, VirtualType } from "mongoose";
import validator from "validator"

 interface Iuser extends Document{
   _id  :string;
   name : string;
   email : string;
   role : "admin" | "user";
   gender : string;
   dob : Date;
   createdAt : Date;
   updatedAt : Date;
    // virutal
    age : number;
}

const schema = new Schema(
{
   _id : {
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
   photo :{
    type:String,
    required : [true , "Enter photo"],
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

schema.virtual("age").get(function(){
  const today = new Date();
  const dob = this.dob;
  let age = today.getFullYear() - dob.getFullYear();

  if(today.getMonth() < dob.getMonth() || (today.getMonth() === dob.getMonth()) && today.getDate() < dob.getDate() )
    {
      age--;
    }
    return age;

})

export  const  User = mongoose.model<Iuser>("User" , schema);  

