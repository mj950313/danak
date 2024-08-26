import { configureStore } from "@reduxjs/toolkit";
import userReducer from "../store/slices/userSlice";
import cartReducer from "../store/slices/cartSlice";

const store = configureStore({
  reducer: {
    user: userReducer, 
    cart: cartReducer
  },
});

export default store;
