import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { AllUserResponse, MessageResponse, UserResponse, deleteUserRequest } from "../../types/api-types";
import { User } from "../../types/types";
import axios from "axios";


export const userApi  = createApi({
  reducerPath : "userApi",
  baseQuery : fetchBaseQuery({
    baseUrl : `${import.meta.env.VITE_SERVER}/api/v1/user/`
  }),
  tagTypes :["User"],
  endpoints : (builder)=>({
    login : builder.mutation<MessageResponse ,User>({
      query : (user) => ({
        url : "new",
        method : "POST",
        body : user
      }),
      invalidatesTags : ["User"],
    }),
    deleteUser : builder.mutation<MessageResponse ,deleteUserRequest>({
      query : ({userId,adminId}) => ({
        url : `${userId}?id=${adminId}`,
        method : "DELETE",
      }),
      invalidatesTags : ["User"],
    }),
   allUser : builder.query<AllUserResponse,string>({
    query : (id)=>`all?id=${id}`,
    providesTags :["User"]
   })
  })
});
 
export const getUser = async(id : string)=>{
  try {
    const {data} : {data : UserResponse} = await axios.get(`${import.meta.env.VITE_SERVER}/api/v1/user/${id}`);
    return data;
  } catch (error) {
    throw error;
  }
};

export const  { 
  useLoginMutation , 
  useAllUserQuery , 
  useDeleteUserMutation } = userApi ;