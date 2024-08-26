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
    incrementTotalItems: (state) => {
      state.totalItems += 1;
    },
    decrementTotalItems: (state) => {
      if (state.totalItems > 0) {
        state.totalItems -= 1;
      }
    },
  },
});

export const { setTotalItems, incrementTotalItems, decrementTotalItems } =
  cartSlice.actions;

export default cartSlice.reducer;
