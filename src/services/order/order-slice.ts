import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

import { createOrderApi } from '../../utils/api';

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

export const createOrder = createAsyncThunk<number, string[], { rejectValue: string }>(
  'order/createOrder',
  async (ingredientIds, { rejectWithValue }) => {
    try {
      return await createOrderApi(ingredientIds);
    } catch (error) {
      if (error instanceof Error) {
        return rejectWithValue(error.message);
      }

      return rejectWithValue('Неизвестная ошибка оформления заказа');
    }
  }
);

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
