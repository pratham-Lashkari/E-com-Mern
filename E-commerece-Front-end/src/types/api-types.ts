import { Product, User } from "./types"

export interface MessageResponse {
  success : boolean,
  message : string
};

export type UserResponse = {
   success : boolean,
   user : User
};
export type AllProductResponse = {
  success : boolean,
  products : Product[]
};

export type CustomError = {
    status : number,
    data : {
      message : string,
      success : boolean
    }
}

export type CategoriesResponse = {
  success : boolean,
  category : string[]
};

export type SearchProductsResponse = AllProductResponse & {
  totalLength  : number
}
export type SearchProductRequest = {
  price : number ,
  page : number ,
  category : string,
  search  : string,
  sort : string
}

export type NewProductRequest = {
  id : string,
  formData : FormData
}