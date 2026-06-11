import { createSlice } from '@reduxjs/toolkit';

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
});

export const { selectIngredients, selectIngredientsIsLoading, selectIngredientsError } =
  ingredientsSlice.selectors;
