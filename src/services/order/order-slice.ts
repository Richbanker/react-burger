import { createSlice } from '@reduxjs/toolkit';

import { createOrder } from './order-actions';

type TOrderState = {
  number: number | null;
  isLoading: boolean;
  error: string | null;
};

const initialState: TOrderState = {
  number: null,
  isLoading: false,
  error: null,
};

export const orderSlice = createSlice({
  name: 'order',
  initialState,
  reducers: {
    clearOrder: (state) => {
      state.number = null;
      state.error = null;
    },
  },
  selectors: {
    selectOrderError: (state) => state.error,
    selectOrderIsLoading: (state) => state.isLoading,
    selectOrderNumber: (state) => state.number,
  },
  extraReducers: (builder) => {
    builder
      .addCase(createOrder.pending, (state) => {
        state.number = null;
        state.isLoading = true;
        state.error = null;
      })
      .addCase(createOrder.fulfilled, (state, action) => {
        state.number = action.payload;
        state.isLoading = false;
      })
      .addCase(createOrder.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload ?? 'Ошибка оформления заказа';
      });
  },
});

export const { clearOrder } = orderSlice.actions;

export const { selectOrderError, selectOrderIsLoading, selectOrderNumber } =
  orderSlice.selectors;
