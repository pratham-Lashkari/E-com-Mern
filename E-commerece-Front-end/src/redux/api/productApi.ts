import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { AllProductResponse, CategoriesResponse, MessageResponse, NewProductRequest, ProductResponse, SearchProductRequest, SearchProductsResponse, UpdateProductRequest } from "../../types/api-types";

export const productAPI = createApi({
  reducerPath : "productApi",
  baseQuery  : fetchBaseQuery({
    baseUrl : `${import.meta.env.VITE_SERVER}/api/v1/product/`
  }),
  tagTypes : ["product"],
  endpoints : (builder)=>({

    latestProduct : builder.query<AllProductResponse , string>({
      query : ()=>"latest" , 
      providesTags:["product"]
    }),

    allProducts : builder.query<AllProductResponse , string>({
      query : (id)=>`admin-product?id=${id}`,
      providesTags:["product"]
    }),

    categories : builder.query<CategoriesResponse , string>({
      query : ()=>`category`,
      providesTags:["product"]

    }),

    serarchProduct : builder.query<SearchProductsResponse , SearchProductRequest>(
      {query : ({price , page , category , sort , search})=> {
         let base  = `all?search=${search}&page=${page}`
         if(price) base += `&price=${price}`;
         if(sort) base += `&sort=${sort}`;
         if(category) base += `&category=${category}`;
         return base;
      },
      providesTags:["product"]
      }),

      productDetails : builder.query<ProductResponse , string>({
        query : (id)=> id , 
        providesTags:["product"]
      }),

      newProduct : builder.mutation<MessageResponse ,NewProductRequest>({
        query : ({formData, id }) => ({
          url : `new?id=${id}`,
          method : "POST",
          body : formData
        }),
        invalidatesTags : ["product"]
      }),

      updateProduct : builder.mutation<MessageResponse ,UpdateProductRequest>({
        query : ({formData, userId , productId }) => ({
          url : `${productId}?id=${userId}`,
          method : "POST",
          body : formData
        }),
        invalidatesTags : ["product"]
      }),

  }),
});

export const { useLatestProductQuery ,
  useAllProductsQuery , 
  useCategoriesQuery , 
  useSerarchProductQuery,
  useNewProductMutation , 
  useProductDetailsQuery
} = productAPI;