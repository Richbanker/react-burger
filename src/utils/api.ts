import { API_URL } from './constants';

import type { TIngredient } from './types';

type TIngredientsResponse = {
  success: boolean;
  data: TIngredient[];
};

type TOrderResponse = {
  success: boolean;
  order: {
    number: number;
  };
};

const checkResponse = async <T>(response: Response): Promise<T> => {
  if (response.ok) {
    return response.json() as Promise<T>;
  }

  return Promise.reject(new Error(`Ошибка: ${response.status}`));
};

export const getIngredientsApi = async (): Promise<TIngredient[]> => {
  const result = await fetch(`${API_URL}/ingredients`).then((response) =>
    checkResponse<TIngredientsResponse>(response)
  );

  if (!result.success) {
    throw new Error('API вернул ошибку');
  }

  return result.data;
};

export const createOrderApi = async (ingredientIds: string[]): Promise<number> => {
  const result = await fetch(`${API_URL}/orders`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ ingredients: ingredientIds }),
  }).then((response) => checkResponse<TOrderResponse>(response));

  if (!result.success) {
    throw new Error('API вернул ошибку');
  }

  return result.order.number;
};
