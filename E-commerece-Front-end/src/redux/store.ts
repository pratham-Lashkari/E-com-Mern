import { configureStore } from "@reduxjs/toolkit";
import { userApi } from "./api/userApi";
import { userReducer } from "./reducer/userReducer";
import { productAPI } from "./api/productApi";

export const server = import.meta.env.VITE_SERVER;

export const store = configureStore({
  reducer : {
    [userApi.reducerPath] : userApi.reducer,
    [productAPI.reducerPath] : productAPI.reducer,
    [userReducer.name] : userReducer.reducer
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware()
      .concat(userApi.middleware)
      .concat(productAPI.middleware)
  
  
});
