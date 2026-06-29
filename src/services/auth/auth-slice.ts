import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

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

type TAuthState = {
  user: TUser | null;
  isAuthChecked: boolean;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
};

const initialState: TAuthState = {
  user: null,
  isAuthChecked: false,
  isAuthenticated: false,
  isLoading: false,
  error: null,
};

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

export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {},
  selectors: {
    selectAuthError: (state) => state.error,
    selectAuthIsChecked: (state) => state.isAuthChecked,
    selectAuthIsLoading: (state) => state.isLoading,
    selectIsAuthenticated: (state) => state.isAuthenticated,
    selectUser: (state) => state.user,
  },
  extraReducers: (builder) => {
    builder
      .addCase(checkUserAuth.pending, (state) => {
        state.error = null;
      })
      .addCase(checkUserAuth.fulfilled, (state, action) => {
        state.user = action.payload;
        state.isAuthenticated = Boolean(action.payload);
        state.isAuthChecked = true;
      })
      .addCase(checkUserAuth.rejected, (state) => {
        state.user = null;
        state.isAuthenticated = false;
        state.isAuthChecked = true;
      })
      .addCase(loginUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.user = action.payload;
        state.isAuthenticated = true;
        state.isAuthChecked = true;
        state.isLoading = false;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload ?? 'Ошибка входа';
      })
      .addCase(registerUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.user = action.payload;
        state.isAuthenticated = true;
        state.isAuthChecked = true;
        state.isLoading = false;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload ?? 'Ошибка регистрации';
      })
      .addCase(logoutUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(logoutUser.fulfilled, (state) => {
        state.user = null;
        state.isAuthenticated = false;
        state.isAuthChecked = true;
        state.isLoading = false;
      })
      .addCase(logoutUser.rejected, (state, action) => {
        state.user = null;
        state.isAuthenticated = false;
        state.isAuthChecked = true;
        state.isLoading = false;
        state.error = action.payload ?? 'Ошибка выхода';
      })
      .addCase(updateUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(updateUser.fulfilled, (state, action) => {
        state.user = action.payload;
        state.isAuthenticated = true;
        state.isLoading = false;
      })
      .addCase(updateUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload ?? 'Ошибка обновления профиля';
      })
      .addCase(forgotPassword.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(forgotPassword.fulfilled, (state) => {
        state.isLoading = false;
      })
      .addCase(forgotPassword.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload ?? 'Ошибка восстановления пароля';
      })
      .addCase(resetPassword.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(resetPassword.fulfilled, (state) => {
        state.isLoading = false;
      })
      .addCase(resetPassword.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload ?? 'Ошибка сброса пароля';
      });
  },
});

export const {
  selectAuthError,
  selectAuthIsChecked,
  selectAuthIsLoading,
  selectIsAuthenticated,
  selectUser,
} = authSlice.selectors;
