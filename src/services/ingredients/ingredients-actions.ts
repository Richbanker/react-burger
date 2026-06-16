import { createAsyncThunk } from '@reduxjs/toolkit';

import { getIngredientsApi } from '../../utils/api';

import type { TIngredient } from '../../utils/types';

export const fetchIngredients = createAsyncThunk<
  TIngredient[],
  void,
  { rejectValue: string }
>('ingredients/fetchIngredients', async (_, { rejectWithValue }) => {
  try {
    return await getIngredientsApi();
  } catch (error) {
    if (error instanceof Error) {
      return rejectWithValue(error.message);
    }

    return rejectWithValue('Неизвестная ошибка загрузки ингредиентов');
  }
});
