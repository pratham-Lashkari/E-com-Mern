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
   if(!product)
      {
         return next(new ErrorHandler("Invalid id",404));
      }
   return res.status(201).send({
    success : true,
    product
   })
});


export const updateProduct =TryCatch(async(req,res,next)=>{

   const id = req.params.id;
 
   const {name, stock,category,price} = req.body;
   const photo = req.file;
   const product = await Product.findById(id);
   console.log(product)
   if(!product)
      {
         return next(new ErrorHandler("Invalid id",404));
      }

   if(photo)
      {
         rm(product.photo!,()=>{
         })
         product.photo = photo.path;
      }
    
      if(name) product.name = name;
      if(stock) product.stock = stock;
      if(category) product.category = category;
      if(price) product.price = price;
   
    await product.save();

   return res.status(200).send({
    success : true,
    message : "Product Updated"
   })
});




export const deleteProduct =TryCatch(async(req,res,next)=>{

   const product = await Product.findById(req.params.id);
   if(!product)
      {
         return next(new ErrorHandler("Invalid id",404));
      }

      rm(product.photo!,()=>{});

      await product.deleteOne();

   return res.status(201).send({
    success : true,
    message :"Product delted successfully"
   })
});
