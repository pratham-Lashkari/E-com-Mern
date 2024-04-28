import { CartItemsType, ShippingInfotype, User } from "./types";


export interface UserReducerInitialState {
  user : User | null;
  loading : boolean;
}

export type CartReducerInitialState =  {
  loading : boolean;
  cartItems : CartItemsType[];
  subTotal : number;
  tax : number;
  shippingCharges : number;
  discount : number;
  total : number;
  shippingInfo : ShippingInfotype;
}