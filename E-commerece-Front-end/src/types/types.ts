export type User = {
  name : string,
  email : string,
  photo : string,
  gender : string,
  role : string,
  dob  :string,
  _id : string
}

export type Product = {
  name : string,
  price : number,
  category : string,
  stock : number,
  photo : string,
  _id? : string
}

export type SkeletonProps = {
  width?  :string,
  length? : number
}

export type ShippingInfotype =  {
  address : string,
  city : string ,
  pincode : number ,
  state : string,
  country : string
};


export type CartItemsType = {
  productId : string, 
  photo : string ,
  name : string,
  price : number , 
  quantity : number,
  stock : number
}


export type OrderItemsType = {
  productId : string, 
  photo : string ,
  name : string,
  price : number , 
  quantity : number,
  stock : number
}

