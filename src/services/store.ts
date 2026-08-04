import { combineSlices, configureStore } from '@reduxjs/toolkit';

import { authSlice } from './auth/auth-slice';
import { burgerConstructorSlice } from './burger-constructor/burger-constructor-slice';
import { currentIngredientSlice } from './current-ingredient/current-ingredient-slice';
import { feedMiddleware } from './feed/feed-middleware';
import { feedSlice } from './feed/feed-slice';
import { ingredientsSlice } from './ingredients/ingredients-slice';
import { orderSlice } from './order/order-slice';
import { profileOrdersMiddleware } from './profile-orders/profile-orders-middleware';
import { profileOrdersSlice } from './profile-orders/profile-orders-slice';

const rootReducer = combineSlices(
  ingredientsSlice,
  burgerConstructorSlice,
  orderSlice,
  currentIngredientSlice,
  authSlice,
  feedSlice,
  profileOrdersSlice
);

export const store = configureStore({
  reducer: rootReducer,
  devTools: import.meta.env.DEV,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(feedMiddleware, profileOrdersMiddleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
