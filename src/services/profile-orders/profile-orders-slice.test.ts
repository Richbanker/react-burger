import { describe, expect, it } from 'vitest';

import { successfulOrdersResponse, testOrder } from '../test-fixtures';
import {
  connectProfileOrders,
  disconnectProfileOrders,
  profileOrdersConnected,
  profileOrdersConnecting,
  profileOrdersDisconnected,
  profileOrdersError,
  profileOrdersMessageReceived,
  profileOrdersSlice,
} from './profile-orders-slice';

type TProfileOrdersState = ReturnType<typeof profileOrdersSlice.reducer>;

const getInitialState = (): TProfileOrdersState =>
  profileOrdersSlice.reducer(undefined, { type: 'unknown' });

describe('profileOrdersSlice', () => {
  it('returns the initial state', () => {
    expect(getInitialState()).toEqual({
      orders: [],
      isConnecting: false,
      isConnected: false,
      error: null,
    });
  });

  it('handles connect without changing state', () => {
    const state = getInitialState();

    expect(profileOrdersSlice.reducer(state, connectProfileOrders())).toEqual(state);
  });

  it('handles disconnect without changing state', () => {
    const state = { ...getInitialState(), isConnected: true };

    expect(profileOrdersSlice.reducer(state, disconnectProfileOrders())).toEqual(state);
  });

  it('handles connecting', () => {
    const state = { ...getInitialState(), error: 'previous error' };

    expect(profileOrdersSlice.reducer(state, profileOrdersConnecting())).toEqual({
      ...state,
      isConnecting: true,
      error: null,
    });
  });

  it('handles connected', () => {
    const state = { ...getInitialState(), isConnecting: true, error: 'previous error' };

    expect(profileOrdersSlice.reducer(state, profileOrdersConnected())).toEqual({
      ...state,
      isConnecting: false,
      isConnected: true,
      error: null,
    });
  });

  it('handles disconnected', () => {
    const state = { ...getInitialState(), isConnecting: true, isConnected: true };

    expect(profileOrdersSlice.reducer(state, profileOrdersDisconnected())).toEqual({
      ...state,
      isConnecting: false,
      isConnected: false,
    });
  });

  it('handles a successful message', () => {
    expect(
      profileOrdersSlice.reducer(
        getInitialState(),
        profileOrdersMessageReceived(successfulOrdersResponse)
      )
    ).toEqual({ ...getInitialState(), orders: [testOrder] });
  });

  it('handles an unsuccessful message', () => {
    const state: TProfileOrdersState = {
      ...getInitialState(),
      orders: [testOrder],
    };

    expect(
      profileOrdersSlice.reducer(
        state,
        profileOrdersMessageReceived({
          success: false,
          orders: [],
          total: 0,
          totalToday: 0,
          message: 'profile orders error',
        })
      )
    ).toEqual({ ...state, error: 'profile orders error' });
  });

  it('handles an error', () => {
    const state = { ...getInitialState(), isConnecting: true };

    expect(
      profileOrdersSlice.reducer(state, profileOrdersError('socket error'))
    ).toEqual({
      ...state,
      isConnecting: false,
      error: 'socket error',
    });
  });
});
