import { TryCatch } from "../middlewares/error.js";
import { Request } from "express";
import { NewOrderRequestTypes } from "../types/user.js";
import { Order } from "../models/order.js";
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
    InvalidateCache({product : true , order: true , admin : true});

    return res.status(201).send({
      success : true,
      message : "Order Created successfully"
    })
})