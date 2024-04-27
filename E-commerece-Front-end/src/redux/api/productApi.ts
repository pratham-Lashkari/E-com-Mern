import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { AllProductResponse, CategoriesResponse, SearchProductRequest, SearchProductsResponse } from "../../types/api-types";

export const productAPI = createApi({
  reducerPath : "productApi",
  baseQuery  : fetchBaseQuery({
    baseUrl : `${import.meta.env.VITE_SERVER}/api/v1/product/`
  }),
  endpoints : (builder)=>({
    latestProduct : builder.query<AllProductResponse , string>({query : ()=>"latest"}),
    allProducts : builder.query<AllProductResponse , string>({query : (id)=>`admin-product?id=${id}`}),
    categories : builder.query<CategoriesResponse , string>({query : ()=>`category`}),
    serarchProduct : builder.query<SearchProductsResponse , SearchProductRequest>(
      {query : ({price , page , category , sort , search})=> {
         let base  = `all?search=${search}&page=${page}`
         if(price) base += `&price=${price}`;
         if(sort) base += `&sort=${sort}`;
         if(category) base += `&category=${category}`;
         return base;
      },
      }),
  }),
});

export const { useLatestProductQuery ,
  useAllProductsQuery , 
  useCategoriesQuery , 
  useSerarchProductQuery } = productAPI;