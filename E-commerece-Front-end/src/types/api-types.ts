import { 
  CartItemsType, 
  Order, 
  Product, 
  ShippingInfotype, 
  User } from "./types";


  export type UserResponse = {
    success : boolean;
    user : User;
 };;
 export type AllProductResponse = {
   success : boolean;
   products : Product[];
 };;

export type CustomError = {
    status : number;
    data : {
      message : string;
      success : boolean;
    };
};

export type CategoriesResponse = {
  success : boolean;
  category : string[];
};;

export type SearchProductsResponse = AllProductResponse & {
  totalLength  : number;
};
export type SearchProductRequest = {
  price : number;
  page : number;
  category : string;
  search  : string;
  sort : string;
};

export type NewProductRequest = {
  id : string;
  formData : FormData;
};


export type ProductResponse = {
  success : boolean;
  product : Product;
};


export type UpdateProductRequest = {
  userId : string;
  productId : string;
  updatedData : Product;
};


export type DeleteProductRequest = {
  userId : string;
  productId : string;
};


export type deleteUserRequest = {
  userId : string
  adminId : string
}


// All response types

export interface MessageResponse {
  success : boolean;
  message : string;
};


export type NewOrderTypes = {
  orderItems : CartItemsType[];
  subTotal  :  number;
  tax : number;
  shippingCharges : number;
  discount : number;
  total : number;
  shippingInfo : ShippingInfotype;
  userId : string;
};

export type UpdateOrderRequesttype = {
  userId : string;
  orderId : string;
};

export type AllOrderResposne = {
  success : boolean;
  orders : Order[];
};

export type OrderDetailsResponse = {
  success : boolean;
  order : Order;
};

export type AllUserResponse = {
  user : User[]
}