import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { AllProductResponse } from "../../types/api-types";

export const productAPI = createApi({
  reducerPath : "productApi",
  baseQuery  : fetchBaseQuery({
    baseUrl : `${import.meta.env.VITE_SERVER}/api/v1/product/`
  }),
  endpoints : (builder)=>({
    latestProduct : builder.query<AllProductResponse , string>({query : ()=>"latest"}),
  }),
});

export const {useLatestProductQuery} = productAPI;