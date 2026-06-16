import { combineSlices, configureStore } from '@reduxjs/toolkit';

import { burgerConstructorSlice } from './burger-constructor/burger-constructor-slice';
import { currentIngredientSlice } from './current-ingredient/current-ingredient-slice';
import { ingredientsSlice } from './ingredients/ingredients-slice';
import { orderSlice } from './order/order-slice';

const rootReducer = combineSlices(
  ingredientsSlice,
  burgerConstructorSlice,
  orderSlice,
  currentIngredientSlice
);

export const store = configureStore({
  reducer: rootReducer,
  devTools: import.meta.env.DEV,
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
