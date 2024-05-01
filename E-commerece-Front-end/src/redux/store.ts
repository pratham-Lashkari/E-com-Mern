import { configureStore } from "@reduxjs/toolkit";
import { userApi } from "./api/userApi";
import { userReducer } from "./reducer/userReducer";
import { productAPI } from "./api/productApi";
import { cartReducer } from "./reducer/cartReducer";
import { orderApi } from "./api/orderApi";
import { dashboardApi } from "./api/dashboardApi";

export const server = import.meta.env.VITE_SERVER;

export const store = configureStore({
  reducer : {
    [userApi.reducerPath] : userApi.reducer,
    [productAPI.reducerPath] : productAPI.reducer,
    [orderApi.reducerPath] : orderApi.reducer,
    [dashboardApi.reducerPath] : dashboardApi.reducer,
    [userReducer.name] : userReducer.reducer,
    [cartReducer.name] : cartReducer.reducer
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware()
      .concat(userApi.middleware)
      .concat(productAPI.middleware)
      .concat(orderApi.middleware)
      .concat(dashboardApi.middleware)
});

export type RootState = ReturnType<typeof store.getState>;