import mongoose  from "mongoose";

type ProductType ={
 name : string;
 photo : string;
 stock : number;
 category : string;
}
const schema = new mongoose.Schema({

  name  :{
    type:String,
    required : [true, "Please enter name"]
  },
  photo:{
    type : String,
    required :[true,"Please inser photo"]
  },
  stock:{
    type :Number,
    required :[true,"Please enter stock"]
  },
  category:{
    type : String,
    required :[true,"Please enter category"]
  }
});

export const Product = mongoose.model<ProductType>("Product",schema);