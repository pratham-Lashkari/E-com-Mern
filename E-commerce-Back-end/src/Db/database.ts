import mongoose from "mongoose";

export const connetToDb =()=>{
  mongoose.connect("mongodb://localhost:27017/E-commerce")
.then(() => console.log("connection successful"))
.catch((err) => console.log(err));
}