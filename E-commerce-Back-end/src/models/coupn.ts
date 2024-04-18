import mongoose, { Schema, model } from "mongoose";

const schema = new Schema({

  code :{
    type : String,
    required : [true , "Please Enter cupon code"],
    unique : true,
  },
  amount : {
    type : Number,
    required : [true , "Please enter the discount amount"]
  }
});

export const Cupon = mongoose.model("Cupon" , schema);