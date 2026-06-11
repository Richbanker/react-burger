import { createSelector, createSlice } from '@reduxjs/toolkit';

import type { TIngredient } from '../../utils/types';
import type { PayloadAction } from '@reduxjs/toolkit';

export type TConstructorIngredient = TIngredient & {
  constructorId: string;
};

type TBurgerConstructorState = {
  bun: TIngredient | null;
  ingredients: TConstructorIngredient[];
};

const initialState: TBurgerConstructorState = {
  bun: null,
  ingredients: [],
};

export const burgerConstructorSlice = createSlice({
  name: 'burgerConstructor',
  initialState,
  reducers: {
    addConstructorIngredient: {
      reducer: (state, action: PayloadAction<TConstructorIngredient>) => {
        if (action.payload.type === 'bun') {
          state.bun = action.payload;
          return;
        }

        state.ingredients.push(action.payload);
      },
      prepare: (ingredient: TIngredient) => ({
        payload: {
          ...ingredient,
          constructorId: crypto.randomUUID(),
        },
      }),
    },

    removeConstructorIngredient: (state, action: PayloadAction<string>) => {
      state.ingredients = state.ingredients.filter(
        (ingredient) => ingredient.constructorId !== action.payload
      );
    },

    clearConstructor: (state) => {
      state.bun = null;
      state.ingredients = [];
    },
  },
  selectors: {
    selectConstructorBun: (state) => state.bun,
    selectConstructorIngredients: (state) => state.ingredients,
  },
});

export const {
  addConstructorIngredient,
  removeConstructorIngredient,
  clearConstructor,
} = burgerConstructorSlice.actions;

export const { selectConstructorBun, selectConstructorIngredients } =
  burgerConstructorSlice.selectors;

export const selectConstructorTotalPrice = createSelector(
  [selectConstructorBun, selectConstructorIngredients],
  (bun, ingredients) => {
    const bunPrice = bun ? bun.price * 2 : 0;
    const ingredientsPrice = ingredients.reduce(
      (sum, ingredient) => sum + ingredient.price,
      0
    );

    return bunPrice + ingredientsPrice;
  }
);
