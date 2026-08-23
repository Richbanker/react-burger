import { describe, expect, it } from 'vitest';

import { successfulOrdersResponse, testOrder } from '../test-fixtures';
import {
  connectFeed,
  disconnectFeed,
  feedConnected,
  feedConnecting,
  feedDisconnected,
  feedError,
  feedMessageReceived,
  feedSlice,
} from './feed-slice';

type TFeedState = ReturnType<typeof feedSlice.reducer>;

const getInitialState = (): TFeedState =>
  feedSlice.reducer(undefined, { type: 'unknown' });

describe('feedSlice', () => {
  it('returns the initial state', () => {
    expect(getInitialState()).toEqual({
      orders: [],
      total: 0,
      totalToday: 0,
      isConnecting: false,
      isConnected: false,
      error: null,
    });
  });

  it('handles connect without changing state', () => {
    const state = getInitialState();

    expect(feedSlice.reducer(state, connectFeed())).toEqual(state);
  });

  it('handles disconnect without changing state', () => {
    const state = { ...getInitialState(), isConnected: true };

    expect(feedSlice.reducer(state, disconnectFeed())).toEqual(state);
  });

  it('handles connecting', () => {
    const state = { ...getInitialState(), error: 'previous error' };

    expect(feedSlice.reducer(state, feedConnecting())).toEqual({
      ...state,
      isConnecting: true,
      error: null,
    });
  });

  it('handles connected', () => {
    const state = { ...getInitialState(), isConnecting: true, error: 'previous error' };

    expect(feedSlice.reducer(state, feedConnected())).toEqual({
      ...state,
      isConnecting: false,
      isConnected: true,
      error: null,
    });
  });

  it('handles disconnected', () => {
    const state = { ...getInitialState(), isConnecting: true, isConnected: true };

    expect(feedSlice.reducer(state, feedDisconnected())).toEqual({
      ...state,
      isConnecting: false,
      isConnected: false,
    });
  });

  it('handles a successful message', () => {
    expect(
      feedSlice.reducer(getInitialState(), feedMessageReceived(successfulOrdersResponse))
    ).toEqual({
      ...getInitialState(),
      orders: [testOrder],
      total: 100,
      totalToday: 10,
    });
  });

  it('handles an unsuccessful message', () => {
    const state: TFeedState = {
      ...getInitialState(),
      orders: [testOrder],
      total: 100,
      totalToday: 10,
    };

    expect(
      feedSlice.reducer(
        state,
        feedMessageReceived({
          success: false,
          orders: [],
          total: 0,
          totalToday: 0,
          message: 'feed error',
        })
      )
    ).toEqual({ ...state, error: 'feed error' });
  });

  it('handles an error', () => {
    const state = { ...getInitialState(), isConnecting: true };

    expect(feedSlice.reducer(state, feedError('socket error'))).toEqual({
      ...state,
      isConnecting: false,
      error: 'socket error',
    });
  });
});
