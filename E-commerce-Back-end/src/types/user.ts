import { NextFunction, Request, Response } from "express";
import { ObjectId } from "mongoose";

export interface NewUsertype{
  _id : string;
  name : string;
  email : string;
  dob : string;
  gender : string;
  photo : string;
  role : string;
}
export interface NewProducttype{
  name : string;
  category : string;
  price : number;
  photo : string;
  stock : number;
}


export type ControllerType = (
  req: Request,
  res: Response,
  next: NextFunction
) => Promise<void | Response<any, Record<string, any>>> ;


export type SearchTypes = {
  search?:string;
  price?:string;
  category?:string;
  page?:string;
  sort?:string;
}

export type BaseQuery = {

  name?:{
      $regex : string;
      $options:string;
  },
  price?:{
    $lte : number;
  },
  category?:string;
}

export type InvalidateCacheType = {
  product?:boolean;
  admin?:boolean;
  order?:boolean;
  key?:string;
}

export type OrderItemType = {
  name : string;
  photo :string;
  price : number;
  quantity : number;
  productId : string;
}
export type shippingInfoType = {
  address : string;
  city :string;
  state : string;
  country : string;
  pincode : number;
}

export type NewOrderRequestTypes = {
  shippingInfo :shippingInfoType;
  user : string;
  subtotal : number;
  tax : number;
  shippingCharges : number;
  discount : number;
  total : number;
  orderItems : OrderItemType[];
}