import { API_URL } from './constants';

import type { TIngredient } from './types';

type TIngredientsResponse = {
  success: boolean;
  data: TIngredient[];
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
