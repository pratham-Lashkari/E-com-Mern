export interface User {
  name : string,
  email : string,
  photo : string,
  gender : string,
  role : string,
  dob  :string,
  _id : string
}

export interface Product {
  name : string,
  price : number,
  category : string,
  stock : number,
  photo : string,
  _id? : string
}

export interface SkeletonProps{
  width?  :string,
  length? : number
}