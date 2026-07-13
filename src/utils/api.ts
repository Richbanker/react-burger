import { API_URL } from './constants';

import type {
  TAuthData,
  TIngredient,
  TRegisterData,
  TResetPasswordData,
  TUser,
  TUserUpdateData,
} from './types';

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

type TAuthResponse = {
  success: boolean;
  user: TUser;
  accessToken: string;
  refreshToken: string;
};

type TUserResponse = {
  success: boolean;
  user: TUser;
};

type TRefreshResponse = {
  success: boolean;
  accessToken: string;
  refreshToken: string;
};

type TSuccessResponse = {
  success: boolean;
  message?: string;
};

const checkResponse = async <T>(response: Response): Promise<T> => {
  if (response.ok) {
    return response.json() as Promise<T>;
  }

  const error = (await response.json().catch(() => null)) as { message?: string } | null;

  return Promise.reject(new Error(error?.message ?? `Ошибка: ${response.status}`));
};

const checkSuccess = <T extends { success: boolean }>(result: T): T => {
  if (!result.success) {
    throw new Error('API вернул ошибку');
  }

  return result;
};

const saveTokens = (accessToken: string, refreshToken: string): void => {
  localStorage.setItem('accessToken', accessToken);
  localStorage.setItem('refreshToken', refreshToken);
};

export const clearTokens = (): void => {
  localStorage.removeItem('accessToken');
  localStorage.removeItem('refreshToken');
};

export const getAccessToken = (): string | null => localStorage.getItem('accessToken');

const getRefreshToken = (): string | null => localStorage.getItem('refreshToken');

const refreshTokenApi = async (): Promise<TRefreshResponse> => {
  const token = getRefreshToken();

  if (!token) {
    throw new Error('Refresh token отсутствует');
  }

  const result = await fetch(`${API_URL}/auth/token`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ token }),
  }).then((response) => checkResponse<TRefreshResponse>(response));

  return checkSuccess(result);
};

const fetchWithRefresh = async <T>(
  url: string,
  options: RequestInit = {}
): Promise<T> => {
  try {
    return await fetch(url, options).then((response) => checkResponse<T>(response));
  } catch (error) {
    if (!(error instanceof Error) || error.message !== 'jwt expired') {
      throw error;
    }

    const refreshData = await refreshTokenApi();

    saveTokens(refreshData.accessToken, refreshData.refreshToken);

    const headers = new Headers(options.headers);

    headers.set('authorization', refreshData.accessToken);

    return fetch(url, {
      ...options,
      headers,
    }).then((response) => checkResponse<T>(response));
  }
};

export const getIngredientsApi = async (): Promise<TIngredient[]> => {
  const result = await fetch(`${API_URL}/ingredients`).then((response) =>
    checkResponse<TIngredientsResponse>(response)
  );

  return checkSuccess(result).data;
};

export const createOrderApi = async (ingredientIds: string[]): Promise<number> => {
  const accessToken = getAccessToken();

  if (!accessToken) {
    throw new Error('Необходимо авторизоваться');
  }

  const result = await fetchWithRefresh<TOrderResponse>(`${API_URL}/orders`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      authorization: accessToken,
    },
    body: JSON.stringify({ ingredients: ingredientIds }),
  });

  return checkSuccess(result).order.number;
};

export const registerApi = async (data: TRegisterData): Promise<TUser> => {
  const result = await fetch(`${API_URL}/auth/register`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  }).then((response) => checkResponse<TAuthResponse>(response));

  const authData = checkSuccess(result);

  saveTokens(authData.accessToken, authData.refreshToken);

  return authData.user;
};

export const loginApi = async (data: TAuthData): Promise<TUser> => {
  const result = await fetch(`${API_URL}/auth/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  }).then((response) => checkResponse<TAuthResponse>(response));

  const authData = checkSuccess(result);

  saveTokens(authData.accessToken, authData.refreshToken);

  return authData.user;
};

export const logoutApi = async (): Promise<void> => {
  const token = getRefreshToken();

  if (!token) {
    clearTokens();
    return;
  }

  try {
    const result = await fetch(`${API_URL}/auth/logout`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ token }),
    }).then((response) => checkResponse<TSuccessResponse>(response));

    checkSuccess(result);
  } finally {
    clearTokens();
  }
};

export const getUserApi = async (): Promise<TUser> => {
  const accessToken = getAccessToken();

  if (!accessToken) {
    throw new Error('Access token отсутствует');
  }

  const result = await fetchWithRefresh<TUserResponse>(`${API_URL}/auth/user`, {
    headers: {
      authorization: accessToken,
    },
  });

  return checkSuccess(result).user;
};

export const updateUserApi = async (data: TUserUpdateData): Promise<TUser> => {
  const accessToken = getAccessToken();

  if (!accessToken) {
    throw new Error('Access token отсутствует');
  }

  const result = await fetchWithRefresh<TUserResponse>(`${API_URL}/auth/user`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      authorization: accessToken,
    },
    body: JSON.stringify(data),
  });

  return checkSuccess(result).user;
};

export const forgotPasswordApi = async (email: string): Promise<void> => {
  const result = await fetch(`${API_URL}/password-reset`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ email }),
  }).then((response) => checkResponse<TSuccessResponse>(response));

  checkSuccess(result);
};

export const resetPasswordApi = async (data: TResetPasswordData): Promise<void> => {
  const result = await fetch(`${API_URL}/password-reset/reset`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  }).then((response) => checkResponse<TSuccessResponse>(response));

  checkSuccess(result);
};
