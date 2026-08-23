import type { TIngredient, TOrder, TOrdersResponse, TUser } from '@utils/types';

export const testBun: TIngredient = {
  _id: 'bun-1',
  name: 'Краторная булка',
  type: 'bun',
  proteins: 80,
  fat: 24,
  carbohydrates: 53,
  calories: 420,
  price: 1255,
  image: '/logo.svg',
  image_mobile: '/logo.svg',
  image_large: '/logo.svg',
  __v: 0,
};

export const replacementBun: TIngredient = {
  ...testBun,
  _id: 'bun-2',
  name: 'Флюоресцентная булка',
  price: 988,
};

export const testSauce: TIngredient = {
  _id: 'sauce-1',
  name: 'Соус Spicy-X',
  type: 'sauce',
  proteins: 30,
  fat: 20,
  carbohydrates: 40,
  calories: 30,
  price: 90,
  image: '/logo.svg',
  image_mobile: '/logo.svg',
  image_large: '/logo.svg',
  __v: 0,
};

export const testMain: TIngredient = {
  _id: 'main-1',
  name: 'Биокотлета',
  type: 'main',
  proteins: 420,
  fat: 142,
  carbohydrates: 242,
  calories: 4242,
  price: 424,
  image: '/logo.svg',
  image_mobile: '/logo.svg',
  image_large: '/logo.svg',
  __v: 0,
};

export const testIngredients: TIngredient[] = [testBun, testSauce, testMain];

export const testUser: TUser = {
  email: 'cosmonaut@example.com',
  name: 'Космонавт',
};

export const testOrder: TOrder = {
  _id: 'order-1',
  ingredients: [testBun._id, testSauce._id, testBun._id],
  status: 'done',
  name: 'Краторный бургер',
  createdAt: '2026-01-01T12:00:00.000Z',
  updatedAt: '2026-01-01T12:10:00.000Z',
  number: 4242,
};

export const successfulOrdersResponse: TOrdersResponse = {
  success: true,
  orders: [testOrder],
  total: 100,
  totalToday: 10,
};
