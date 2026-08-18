import { describe, expect, it } from 'vitest';

import { createOrder } from './order-actions';
import { clearOrder, orderSlice } from './order-slice';

type TOrderState = ReturnType<typeof orderSlice.reducer>;

const getInitialState = (): TOrderState =>
  orderSlice.reducer(undefined, { type: 'unknown' });

describe('orderSlice', () => {
  it('returns the initial state', () => {
    expect(getInitialState()).toEqual({ number: null, isLoading: false, error: null });
  });

  it('clears an order', () => {
    expect(
      orderSlice.reducer(
        { number: 4242, isLoading: false, error: 'previous error' },
        clearOrder()
      )
    ).toEqual({ number: null, isLoading: false, error: null });
  });

  it('handles createOrder.pending', () => {
    expect(
      orderSlice.reducer(
        { number: 4242, isLoading: false, error: 'previous error' },
        { type: createOrder.pending.type }
      )
    ).toEqual({ number: null, isLoading: true, error: null });
  });

  it('handles createOrder.fulfilled', () => {
    expect(
      orderSlice.reducer(
        { ...getInitialState(), isLoading: true },
        { type: createOrder.fulfilled.type, payload: 4242 }
      )
    ).toEqual({ number: 4242, isLoading: false, error: null });
  });

  it('handles createOrder.rejected with action payload', () => {
    expect(
      orderSlice.reducer(
        { ...getInitialState(), isLoading: true },
        { type: createOrder.rejected.type, payload: 'order error' }
      )
    ).toEqual({ number: null, isLoading: false, error: 'order error' });
  });

  it('uses a fallback error for createOrder.rejected without action payload', () => {
    expect(
      orderSlice.reducer(
        { ...getInitialState(), isLoading: true },
        { type: createOrder.rejected.type }
      )
    ).toEqual({
      number: null,
      isLoading: false,
      error: 'Ошибка оформления заказа',
    });
  });
});
