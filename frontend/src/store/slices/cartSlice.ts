import { createSlice } from '@reduxjs/toolkit';

export interface CartState {
    totalItems: number;
  }

const initialState:CartState = {
  totalItems: 0,
};

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    setTotalItems: (state, action) => {
      state.totalItems = action.payload;
    },
    resetCart: (state) => {
      state.totalItems = 0;
    },
  },
});

export const { setTotalItems, resetCart } =
  cartSlice.actions;

export default cartSlice.reducer;
