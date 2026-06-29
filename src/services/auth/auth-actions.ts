import { createAsyncThunk } from '@reduxjs/toolkit';

import {
  clearTokens,
  forgotPasswordApi,
  getAccessToken,
  getUserApi,
  loginApi,
  logoutApi,
  registerApi,
  resetPasswordApi,
  updateUserApi,
} from '@utils/api';

import type {
  TAuthData,
  TRegisterData,
  TResetPasswordData,
  TUser,
  TUserUpdateData,
} from '@utils/types';

const getErrorMessage = (error: unknown, fallback: string): string => {
  if (error instanceof Error) {
    return error.message;
  }

  return fallback;
};

export const checkUserAuth = createAsyncThunk<
  TUser | null,
  void,
  { rejectValue: string }
>('auth/checkUserAuth', async (_, { rejectWithValue }) => {
  if (!getAccessToken()) {
    return null;
  }

  try {
    return await getUserApi();
  } catch (error) {
    clearTokens();

    return rejectWithValue(getErrorMessage(error, 'Не удалось проверить авторизацию'));
  }
});

export const loginUser = createAsyncThunk<TUser, TAuthData, { rejectValue: string }>(
  'auth/login',
  async (data, { rejectWithValue }) => {
    try {
      return await loginApi(data);
    } catch (error) {
      return rejectWithValue(getErrorMessage(error, 'Ошибка входа'));
    }
  }
);

export const registerUser = createAsyncThunk<
  TUser,
  TRegisterData,
  { rejectValue: string }
>('auth/register', async (data, { rejectWithValue }) => {
  try {
    return await registerApi(data);
  } catch (error) {
    return rejectWithValue(getErrorMessage(error, 'Ошибка регистрации'));
  }
});

export const logoutUser = createAsyncThunk<void, void, { rejectValue: string }>(
  'auth/logout',
  async (_, { rejectWithValue }) => {
    try {
      await logoutApi();
    } catch (error) {
      return rejectWithValue(getErrorMessage(error, 'Ошибка выхода'));
    }
  }
);

export const updateUser = createAsyncThunk<
  TUser,
  TUserUpdateData,
  { rejectValue: string }
>('auth/updateUser', async (data, { rejectWithValue }) => {
  try {
    return await updateUserApi(data);
  } catch (error) {
    return rejectWithValue(getErrorMessage(error, 'Ошибка обновления профиля'));
  }
});

export const forgotPassword = createAsyncThunk<void, string, { rejectValue: string }>(
  'auth/forgotPassword',
  async (email, { rejectWithValue }) => {
    try {
      await forgotPasswordApi(email);
    } catch (error) {
      return rejectWithValue(getErrorMessage(error, 'Ошибка восстановления пароля'));
    }
  }
);

export const resetPassword = createAsyncThunk<
  void,
  TResetPasswordData,
  { rejectValue: string }
>('auth/resetPassword', async (data, { rejectWithValue }) => {
  try {
    await resetPasswordApi(data);
  } catch (error) {
    return rejectWithValue(getErrorMessage(error, 'Ошибка сброса пароля'));
  }
});
