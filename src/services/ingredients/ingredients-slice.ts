import { createSlice } from '@reduxjs/toolkit';

import { fetchIngredients } from './ingredients-actions';

import type { TIngredient } from '../../utils/types';

type TIngredientsState = {
  items: TIngredient[];
  isLoading: boolean;
  error: string | null;
};

const initialState: TIngredientsState = {
  items: [],
  isLoading: false,
  error: null,
};

export const ingredientsSlice = createSlice({
  name: 'ingredients',
  initialState,
  reducers: {},
  selectors: {
    selectIngredients: (state) => state.items,
    selectIngredientsIsLoading: (state) => state.isLoading,
    selectIngredientsError: (state) => state.error,
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchIngredients.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchIngredients.fulfilled, (state, action) => {
        state.isLoading = false;
        state.items = action.payload;
      })
      .addCase(fetchIngredients.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload ?? 'шибка загрузки ингредиентов';
      });
  },
});

export const { selectIngredients, selectIngredientsIsLoading, selectIngredientsError } =
  ingredientsSlice.selectors;
