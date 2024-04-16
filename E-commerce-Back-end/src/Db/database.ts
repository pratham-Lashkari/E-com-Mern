import mongoose from "mongoose";

export const connetToDb =(url:string)=>{
  mongoose.connect(url)
.then(() => console.log("connection successful"))
.catch((err) => console.log(err));
}