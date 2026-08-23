import { describe, expect, it } from 'vitest';

import { testUser } from '../test-fixtures';
import {
  checkUserAuth,
  forgotPassword,
  loginUser,
  logoutUser,
  registerUser,
  resetPassword,
  updateUser,
} from './auth-actions';
import { authSlice } from './auth-slice';

type TAuthState = ReturnType<typeof authSlice.reducer>;

const reduce = (state: TAuthState, type: string, payload?: unknown): TAuthState =>
  authSlice.reducer(state, { type, payload });

const getInitialState = (): TAuthState =>
  authSlice.reducer(undefined, { type: 'unknown' });

describe('authSlice', () => {
  it('returns the initial state', () => {
    expect(getInitialState()).toEqual({
      user: null,
      isAuthChecked: false,
      isAuthenticated: false,
      isLoading: false,
      error: null,
    });
  });

  describe('checkUserAuth', () => {
    it('handles pending', () => {
      const state = { ...getInitialState(), error: 'previous error' };

      expect(reduce(state, checkUserAuth.pending.type)).toEqual({
        ...state,
        error: null,
      });
    });

    it('handles fulfilled', () => {
      expect(reduce(getInitialState(), checkUserAuth.fulfilled.type, testUser)).toEqual({
        ...getInitialState(),
        user: testUser,
        isAuthenticated: true,
        isAuthChecked: true,
      });
    });

    it('handles rejected', () => {
      const state: TAuthState = {
        ...getInitialState(),
        user: testUser,
        isAuthenticated: true,
      };

      expect(reduce(state, checkUserAuth.rejected.type, 'auth error')).toEqual({
        ...state,
        user: null,
        isAuthenticated: false,
        isAuthChecked: true,
      });
    });
  });

  describe.each([
    {
      name: 'loginUser',
      pendingType: loginUser.pending.type,
      fulfilledType: loginUser.fulfilled.type,
      rejectedType: loginUser.rejected.type,
    },
    {
      name: 'registerUser',
      pendingType: registerUser.pending.type,
      fulfilledType: registerUser.fulfilled.type,
      rejectedType: registerUser.rejected.type,
    },
  ])('$name', ({ pendingType, fulfilledType, rejectedType }) => {
    it('handles pending', () => {
      const state = { ...getInitialState(), error: 'previous error' };

      expect(reduce(state, pendingType)).toEqual({
        ...state,
        isLoading: true,
        error: null,
      });
    });

    it('handles fulfilled', () => {
      const state = { ...getInitialState(), isLoading: true };

      expect(reduce(state, fulfilledType, testUser)).toEqual({
        ...state,
        user: testUser,
        isAuthenticated: true,
        isAuthChecked: true,
        isLoading: false,
      });
    });

    it('handles rejected', () => {
      const state = { ...getInitialState(), isLoading: true };

      expect(reduce(state, rejectedType, 'request error')).toEqual({
        ...state,
        isLoading: false,
        error: 'request error',
      });
    });
  });

  describe('logoutUser', () => {
    const authenticatedState: TAuthState = {
      user: testUser,
      isAuthChecked: true,
      isAuthenticated: true,
      isLoading: false,
      error: null,
    };

    it('handles pending', () => {
      expect(reduce(authenticatedState, logoutUser.pending.type)).toEqual({
        ...authenticatedState,
        isLoading: true,
      });
    });

    it('handles fulfilled', () => {
      expect(
        reduce({ ...authenticatedState, isLoading: true }, logoutUser.fulfilled.type)
      ).toEqual({
        ...authenticatedState,
        user: null,
        isAuthenticated: false,
        isLoading: false,
      });
    });

    it('handles rejected', () => {
      expect(
        reduce(
          { ...authenticatedState, isLoading: true },
          logoutUser.rejected.type,
          'logout error'
        )
      ).toEqual({
        ...authenticatedState,
        user: null,
        isAuthenticated: false,
        isLoading: false,
        error: 'logout error',
      });
    });
  });

  describe('updateUser', () => {
    it('handles pending', () => {
      const state = { ...getInitialState(), error: 'previous error' };

      expect(reduce(state, updateUser.pending.type)).toEqual({
        ...state,
        isLoading: true,
        error: null,
      });
    });

    it('handles fulfilled', () => {
      const state = { ...getInitialState(), isLoading: true };

      expect(reduce(state, updateUser.fulfilled.type, testUser)).toEqual({
        ...state,
        user: testUser,
        isAuthenticated: true,
        isLoading: false,
      });
    });

    it('handles rejected', () => {
      const state = { ...getInitialState(), isLoading: true };

      expect(reduce(state, updateUser.rejected.type, 'update error')).toEqual({
        ...state,
        isLoading: false,
        error: 'update error',
      });
    });
  });

  describe.each([
    {
      name: 'forgotPassword',
      pendingType: forgotPassword.pending.type,
      fulfilledType: forgotPassword.fulfilled.type,
      rejectedType: forgotPassword.rejected.type,
    },
    {
      name: 'resetPassword',
      pendingType: resetPassword.pending.type,
      fulfilledType: resetPassword.fulfilled.type,
      rejectedType: resetPassword.rejected.type,
    },
  ])('$name', ({ pendingType, fulfilledType, rejectedType }) => {
    it('handles pending', () => {
      const state = { ...getInitialState(), error: 'previous error' };

      expect(reduce(state, pendingType)).toEqual({
        ...state,
        isLoading: true,
        error: null,
      });
    });

    it('handles fulfilled', () => {
      const state = { ...getInitialState(), isLoading: true };

      expect(reduce(state, fulfilledType)).toEqual({
        ...state,
        isLoading: false,
      });
    });

    it('handles rejected', () => {
      const state = { ...getInitialState(), isLoading: true };

      expect(reduce(state, rejectedType, 'password error')).toEqual({
        ...state,
        isLoading: false,
        error: 'password error',
      });
    });
  });
});
