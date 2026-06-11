import { createSlice } from '@reduxjs/toolkit';

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
    selectOrderNumber: (state) => state.number,
    selectOrderIsLoading: (state) => state.isLoading,
    selectOrderError: (state) => state.error,
  },
});

export const { clearOrder } = orderSlice.actions;

export const { selectOrderNumber, selectOrderIsLoading, selectOrderError } =
  orderSlice.selectors;
