export type TIngredient = {
  _id: string;
  name: string;
  type: 'bun' | 'sauce' | 'main';
  proteins: number;
  fat: number;
  carbohydrates: number;
  calories: number;
  price: number;
  image: string;
  image_mobile: string;
  image_large: string;
  __v: number;
};

export type TUser = {
  email: string;
  name: string;
};

export type TAuthData = {
  email: string;
  password: string;
};

export type TRegisterData = TAuthData & {
  name: string;
};

export type TResetPasswordData = {
  password: string;
  token: string;
};

export type TUserUpdateData = Partial<TUser> & {
  password?: string;
};

export type TOrderStatus = 'created' | 'pending' | 'done';

export type TOrder = {
  _id: string;
  ingredients: string[];
  status: TOrderStatus;
  name: string;
  createdAt: string;
  updatedAt: string;
  number: number;
};

export type TOrdersResponse = {
  success: boolean;
  orders: TOrder[];
  total: number;
  totalToday: number;
  message?: string;
};
