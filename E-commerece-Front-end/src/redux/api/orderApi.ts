import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { MessageResponse, NewOrderTypes } from "../../types/api-types";


export const orderApi = createApi({
  reducerPath : "orderApi",
  baseQuery : fetchBaseQuery({
    baseUrl : `${import.meta.env.VITE_SERVER}/api/v1/order/`
  }),
  endpoints : (builder)=>({
     newOrder : builder.mutation<MessageResponse ,NewOrderTypes >({
      query : (order)=> ({
        url : "new",
        method : "POST",
        body : order
      }),
     }),

  }),

});

export const {useNewOrderMutation} = orderApi;