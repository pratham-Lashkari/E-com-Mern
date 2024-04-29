import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { AllOrderResposne, MessageResponse, NewOrderTypes, OrderDetailsResponse, UpdateOrderRequesttype } from "../../types/api-types";


export const orderApi = createApi({
  reducerPath : "orderApi",
  baseQuery : fetchBaseQuery({
    baseUrl : `${import.meta.env.VITE_SERVER}/api/v1/order/`
  }),
  tagTypes : ["orders"],
  endpoints : (builder)=>({

     newOrder : builder.mutation<MessageResponse ,NewOrderTypes >({
      query : (order)=> ({
        url : "new",
        method : "POST",
        body : order
      }),
      invalidatesTags : ["orders"],
    }),

    updateOrder : builder.mutation<MessageResponse ,UpdateOrderRequesttype >({
      query : ({orderId , userId})=> ({
        url : `${orderId}?id=${userId}`,
        method : "PUT",
      }),
      invalidatesTags : ["orders"],
    }),

    deleteOrder : builder.mutation<MessageResponse ,UpdateOrderRequesttype >({
      query : ({orderId , userId})=> ({
        url : `${orderId}?id=${userId}`,
        method : "DELETE",
      }),
      invalidatesTags : ["orders"],
    }),

    myOrders : builder.query<AllOrderResposne , string>({
      query : (id)=> `my?id=${id}`,
      providesTags :["orders"]
    }),

    allOrders : builder.query<AllOrderResposne , string>({
      query : (id)=> `all?id=${id}`,
      providesTags :["orders"]
    }),

    ordersDetails : builder.query<OrderDetailsResponse , string>({
      query : (id)=> id,
      providesTags :["orders"]
    })

  }),
});

export const { 
  useNewOrderMutation ,
  useAllOrdersQuery , 
  useDeleteOrderMutation,
  useUpdateOrderMutation,
  useMyOrdersQuery,
  useOrdersDetailsQuery } = orderApi;