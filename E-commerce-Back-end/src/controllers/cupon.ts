import { stripe } from "../app.js";
import { TryCatch } from "../middlewares/error.js";
import { Cupon } from "../models/coupn.js";
import ErrorHandler from "../utils/utitlity-class.js";

export const createPaymentIntent = TryCatch(async (req,res,next)=>{
  
  const {amount} = req.body;
  if(!amount)
    {
      return next(new ErrorHandler("Please enter   amount" , 400));
    }
    const payemntIntent = await stripe.paymentIntents.create({
      amount:Number(amount) * 100,
      currency :"inr"
    });
    return res.status(201).send({
      success : true,
      clientSecret : payemntIntent.client_secret
    })
});


export const newCupon = TryCatch(async (req,res,next)=>{
  
  const {cupon , amount} = req.body;
  if(!cupon || !amount)
    {
      return next(new ErrorHandler("Please enter both cupon and amount" , 400));
    }

    await Cupon.create({code : cupon , amount});
    return res.status(201).send({
      success : true,
      message : `Cupon ${cupon} created successfully`
    })
});


export const applyDiscount = TryCatch(async (req,res,next)=>{
  
  const {cupon} = req.query;
  if(!cupon)
    {
      return next(new ErrorHandler("Please enter cupon " , 400));
    }

   const discount =  await Cupon.findOne({code : cupon as string});

   if(!discount)
    {
      return next(new ErrorHandler("Cannot find cupon" , 401));
    }
    return res.status(201).send({
      success : true,
      discount : discount.amount
    })
});


export const getAllCupons =TryCatch( async(req,res,next)=>{

   const cupons = await Cupon.find();
   if(!cupons){
    return next(new ErrorHandler("No cupons available on database",404));
   }
   return res.status(201).send({
    success : true,
    cupons
  });
});

export const deleteCupon =TryCatch( async(req,res,next)=>{
   const {id} = req.params;
   const cupon = await Cupon.findByIdAndDelete(id);
   if(!cupon) {
    return next(new ErrorHandler("Cupon not found" , 404));
   }
  return res.status(201).send({
   success : true,
   message : `Cupons ${cupon.code} deleted successfully`
 });
});