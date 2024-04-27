import { Request } from "express";
import { rm } from "fs";
import { myCache } from "../app.js";
import { TryCatch } from "../middlewares/error.js";
import { Product } from "../models/product.js";
import { BaseQuery, NewProducttype, SearchTypes } from "../types/user.js";
import { InvalidateCache } from "../utils/feature.js";
import ErrorHandler from "../utils/utitlity-class.js";


export const getLatestProduct =TryCatch(async(req:Request<{},{},NewProducttype>,res,next)=>{

   let products;
   
   if(myCache.has("latest-Product"))
      {
         products = JSON.parse(myCache.get("latest-Product") as string);
      }
      else{
         products = await Product.find({}).sort({createdAt : -1}).limit(5);
         myCache.set("latest-Product",JSON.stringify(products));
      }

   return res.status(201).send({
    success : true,
    products
   })
});


export const getAllCategories =TryCatch(async(req:Request<{},{},NewProducttype>,res,next)=>{
    let category;
    if(myCache.has("category"))
      {
         category = JSON.parse(myCache.get("category")!);
      }
      else{ 
         category = await Product.distinct("category");
         myCache.set("category",JSON.stringify(category));
      }
   return res.status(201).send({
    success : true,
    category
   })
});




export const getAdminProduct =TryCatch(async(req:Request<{},{},NewProducttype>,res,next)=>{

   let products;
   
   if(myCache.has("admin-Product"))
      {
         products = JSON.parse(myCache.get("admin-Product") as string);
      }
      else{
         products = await Product.find({});
         myCache.set("admin-Product",JSON.stringify(products));
      }
   return res.status(201).send({
    success : true,
    products
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
   await InvalidateCache({product:true});
    
   const product = await Product.create({
    name,
    price,
    category:category.toLowerCase(),
    stock,
    photo:photo?.path
   });

    InvalidateCache({product:true});

   return res.status(201).send({
    success : true,
    message : "Product created"
   })
});


export const updateProduct =TryCatch(async(req,res,next)=>{

   const id = req.params.id;
 
   const {name, stock,category,price} = req.body;
   const photo = req.file;
   const product = await Product.findById(id);
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

   await InvalidateCache({product:true});


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

     InvalidateCache({product:true});

   return res.status(201).send({
    success : true,
    message :"Product delted successfully"
   })
});


export const serarchAllFilters = TryCatch(async(req:Request<{},{},{},SearchTypes>,res,next)=>{
     
     const {search , category , price , sort } = req.query;
     const page = Number(req.query.page);
     const limit = Number(process.env.PRODUCT_PER_PAGE) || 8;
     const skip = (page - 1) * limit;

      const baseQuery : BaseQuery ={};
      if(search)
         {
            baseQuery.name = {
               $regex : search,
               $options : "i"
            };
         }
      if(price)
         {
            baseQuery.price = {
               $lte:Number(price)
            }
         }
      if(category)
         {
            baseQuery.category = category;
         } 


      const productPromise = await Product.find(baseQuery).sort(
          sort && {price:sort==="asc"?1:-1}
         ).limit(limit).skip(skip);

      const filterProductsPromise = await Product.find(baseQuery);

      const [products,filterProducts] = await Promise.all([productPromise,filterProductsPromise]);
      

      /*
    const product = await Product.find(baseQuery).sort(
      sort && {price:sort==="asc"?1:-1}
    ).limit(limit).skip(skip);

    const filterProducts = await Product.find(baseQuery);
    */

    if(!products)
      {
         return next(new ErrorHandler("Empty stock" , 404));
      }

   const totalLength = Math.ceil(filterProducts.length/limit);

      return res.status(200).send({
         success : true,
         products,
         totalLength
      })
});