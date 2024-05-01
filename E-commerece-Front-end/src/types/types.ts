import { ReactElement } from "react";

export type User = {
  name : string;
  email : string;
  photo : string;
  gender : string;
  role : string;
  dob  :string;
  _id : string;
}

export type Product = {
  name : string;
  price : number;
  category : string;
  stock : number;
  photo : string;
  _id? : string;
}

export type SkeletonProps = {
  width?  :string;
  length? : number;
}

export type ShippingInfotype =  {
  address : string;
  city : string;
  pincode : number;
  state : string;
  country : string;
};


export type CartItemsType = {
  productId : string;
  photo : string;
  name : string;
  price : number; 
  quantity : number;
  stock : number;
}


export type OrderItemsType = Omit<CartItemsType,"stock"> & {
  _id : string;
}

export type Order = {
  orderItems : OrderItemsType[];
  shippingInfo : ShippingInfotype;
  subtotal  :  number;
  tax : number;
  shippingCharges : number;
  discount : number;
  total : number;
  status : string,
  user : {
    name : string;
    _id : string;
  };
  _id:string;
}

type CountAndChange = {
  revenues : number,
  revenue?:number,
  product : number,
  user : number,
  order : number,
}
type LatestTransaction = {
  _id: string;
  amount: number;
  discount: number;
  quantity: number;
  status: string;
}

export type Stats = {
  categoryCount : Record<string,number>[],
  changePercent : CountAndChange,
  count : CountAndChange,
  chart : {
    orderMonthCounts :number[],
    orderMonthRevenue : number[]
  }
  useRatio : {
    male : number,
    female : number
  };
  modifiedLatestTransaction :LatestTransaction[]
}


type OrderFullFillment = {
  processing: number;
  shipped: number;
  delivered: number;
};
type StockAvaliablity =  {
  inStock: number;
  outStock: number;
};
type RevenuseDistribution = {
  netMargin: number;
  discount: number;
  productionCost: number;
  burnt: number;
  marketingCost: number;
};
export type AdminCustomer ={
  user: number;
  admin: number;
};
export type UserAgeGroup = {
  teen: number;
  adult: number;
  old: number;
};

export type Pie = {
  orderFullFillmentRation : OrderFullFillment;
  productCategories : Record<string, number>[];
  stockAvaliablity :StockAvaliablity;
  revenueDistribution :RevenuseDistribution ;
  adminCustomer :AdminCustomer;
  userAgeGroup : UserAgeGroup;
}
