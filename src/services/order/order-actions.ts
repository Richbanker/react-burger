import { createAsyncThunk } from '@reduxjs/toolkit';

import { createOrderApi } from '@utils/api';

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
