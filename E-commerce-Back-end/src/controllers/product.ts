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
   const product = await Product.create({
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

   const category = await Product.distinct("category");
   return res.status(201).send({
    success : true,
    category
   })
});




export const getAdminProduct =TryCatch(async(req:Request<{},{},NewProducttype>,res,next)=>{

   const product = await Product.find({});
   return res.status(201).send({
    success : true,
    product
   })
});



export const getSingleProduct =TryCatch(async(req,res,next)=>{

   const product = await Product.findById(req.params.id);
   return res.status(201).send({
    success : true,
    product
   })
});


export const updateProduct =TryCatch(async(req,res,next)=>{

   const id = req.params.id;
   const {name, stock,category,price} = req.body;
   const photo = req.file;
   let product = await Product.findById(id);
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
    product = await Product.create({
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