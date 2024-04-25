import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query";
import { server } from "../reducer/store";

export const userApi = createApi({
  reducerPath : "userApi",
  baseQuery : fetchBaseQuery({
    baseUrl : server
  }),
  endpoints : (builder)=>({
    login : builder.mutation({
      query : (user) => ({
        url : "new",
        method : "POST",
        body : user
      }),
    }),
  }),
});