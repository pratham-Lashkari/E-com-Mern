import { Request } from "express";
import { TryCatch } from "../middlewares/error.js";
import { NewProducttype } from "../types/user.js";
import { Product } from "../models/product.js";
import ErrorHandler from "../utils/utitlity-class.js";
import { rm } from "fs";


export const addProduct =TryCatch(async(req:Request<{},{},NewProducttype>,res,next)=>{

   const {name, stock,category,price} = req.body;
   const photo = req.file;

   if(!photo)
      {
         return next(new ErrorHandler("Please enter photo",404));
      }

   if(!name || !photo || !stock || !price)
      {
         rm(photo.path,()=>{
         })
         return next(new ErrorHandler("Please enter all fields",404))
      }
   const product = Product.create({
    name,
    price,
    category:category.toLowerCase(),
    stock,
    photo:photo?.path
   });

   return res.status(201).send({
    success : true,
    message : "Product created"
   })
});


export const getLatestProduct =TryCatch(async(req:Request<{},{},NewProducttype>,res,next)=>{

   const product = await Product.find({}).sort({createdAt : -1}).limit(5);
   return res.status(201).send({
    success : true,
    product
   })
});


export const getAllCategories =TryCatch(async(req:Request<{},{},NewProducttype>,res,next)=>{

   const product = await Product.find({}).sort({createdAt : -1}).limit(5);
   return res.status(201).send({
    success : true,
    product
   })
});