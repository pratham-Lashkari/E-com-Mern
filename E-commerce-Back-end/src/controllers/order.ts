import { Request } from "express";
import { myCache } from "../app.js";
import { TryCatch } from "../middlewares/error.js";
import { Order } from "../models/order.js";
import { NewOrderRequestTypes } from "../types/user.js";
import { InvalidateCache, reducedStock } from "../utils/feature.js";
import ErrorHandler from "../utils/utitlity-class.js";

export const newOrder = TryCatch(async(req:Request<{},{},NewOrderRequestTypes>,res,next)=>{

   const {shippingInfo , 
    orderItems,
    user ,
    subtotal , 
    tax ,
    shippingCharges,
    discount , 
    total} = req.body;

     if(!shippingInfo || !orderItems || !user || !subtotal || !tax   || !total)
      {
        return next(new ErrorHandler("Please enter all fields",404));
      }
    const order = await Order.create({
      shippingInfo,
      orderItems,
      user,
      subtotal,
      tax,
      shippingCharges,
      discount,
      total
    });

    
    await reducedStock(orderItems);

    return res.status(201).send({
      success : true,
      message : "Order Created successfully"
    })
});


export const myOrder = TryCatch(async(req:Request<{},{},NewOrderRequestTypes>,res,next)=>{
    const {id:user}  = req.query; 
    const key = `my-order-${user}`;
    let order;
    if(myCache.has(key))
      {
        order = JSON.parse(myCache.get(key) as string);
      }
      else{
        order  = await Order.find({user});
        myCache.set(key , JSON.stringify(order));
      }
   InvalidateCache({product : true , order : true , admin : true ,key});

   return res.status(201).send({
     success : true,
     order
   })
});


export  const allOrder = TryCatch(async(req,res,next)=>{

  const key = "all-order";
  let orders;
  if(myCache.has(key))
    {
      orders = JSON.parse(myCache.get(key) as string);
    }
    else{
      orders  = await Order.find().populate("user","name");
      myCache.set(key , JSON.stringify(orders));
    }
    InvalidateCache({product : true , admin :true , order: true , key });

 return res.status(200).send({
   success : true,
   orders
 })
});



export  const getSingleOrder = TryCatch(async(req,res,next)=>{

   const {id} = req.params;

   const key = `order-${id}`
   let order;
   if(myCache.has(key))
    {
      order = JSON.parse(myCache.get(key)!);
    }
    else{
      order  = await Order.findById(id).populate("user","name");
      if(!order)
        {
          return next(new ErrorHandler("Order not found ", 404));
        }
      myCache.set(key ,JSON.stringify(order))
    }

    InvalidateCache({product : true , order : true , admin : true ,key});

    return res.status(200).send({
      success : true,
      order
    })
});


export const processOrder =TryCatch(async(req,res,next)=>{

  const {id} = req.params;
  const key = `order-${id}`


  const order = await Order.findById(id);

  if(!order) return next(new ErrorHandler("Order not found" , 404));

  switch (order.status) {
    case "Processing":
      order.status = "Shipped";
      break;
    case "Shipped":
      order.status = "Delivered";
    default:
      order.status = "Delivered";
      break;
  }
   await order.save();

   InvalidateCache({product:true , order:true,admin:true,key})
   
   return res.status(200).send({
    success : true,
    message : `Order  ${order.status} Successfully`
   })
});


export const deleteOrder =TryCatch(async(req,res,next)=>{

  const {id} = req.params;
  const key = `order-${id}`

  const order = await Order.findById(id);

  if(!order) return next(new ErrorHandler("Order not found" , 404));

   await order.deleteOne();

   InvalidateCache({product : true , order : true , admin : true ,key});
   return res.status(200).send({
    success : true,
    message : "Deleted Successfully"
   });
});

