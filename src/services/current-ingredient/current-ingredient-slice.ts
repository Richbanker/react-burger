import { createSlice } from '@reduxjs/toolkit';

import type { TIngredient } from '../../utils/types';
import type { PayloadAction } from '@reduxjs/toolkit';

type TCurrentIngredientState = {
  item: TIngredient | null;
};

const initialState: TCurrentIngredientState = {
  item: null,
};

export const currentIngredientSlice = createSlice({
  name: 'currentIngredient',
  initialState,
  reducers: {
    setCurrentIngredient: (state, action: PayloadAction<TIngredient>) => {
      state.item = action.payload;
    },

    clearCurrentIngredient: (state) => {
      state.item = null;
    },
  },
  selectors: {
    selectCurrentIngredient: (state) => state.item,
  },
});

export const { setCurrentIngredient, clearCurrentIngredient } =
  currentIngredientSlice.actions;

export const { selectCurrentIngredient } = currentIngredientSlice.selectors;
