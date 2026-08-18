import { describe, expect, it } from 'vitest';

import { testIngredients } from '../test-fixtures';
import { fetchIngredients } from './ingredients-actions';
import { ingredientsSlice } from './ingredients-slice';

type TIngredientsState = ReturnType<typeof ingredientsSlice.reducer>;

const getInitialState = (): TIngredientsState =>
  ingredientsSlice.reducer(undefined, { type: 'unknown' });

describe('ingredientsSlice', () => {
  it('returns the initial state', () => {
    expect(getInitialState()).toEqual({ items: [], isLoading: false, error: null });
  });

  it('handles fetchIngredients.pending', () => {
    const state = { ...getInitialState(), error: 'previous error' };

    expect(
      ingredientsSlice.reducer(state, { type: fetchIngredients.pending.type })
    ).toEqual({
      ...state,
      isLoading: true,
      error: null,
    });
  });

  it('handles fetchIngredients.fulfilled', () => {
    const state = { ...getInitialState(), isLoading: true };

    expect(
      ingredientsSlice.reducer(state, {
        type: fetchIngredients.fulfilled.type,
        payload: testIngredients,
      })
    ).toEqual({ ...state, isLoading: false, items: testIngredients });
  });

  it('handles fetchIngredients.rejected with action payload', () => {
    const state = { ...getInitialState(), isLoading: true };

    expect(
      ingredientsSlice.reducer(state, {
        type: fetchIngredients.rejected.type,
        payload: 'ingredients error',
      })
    ).toEqual({ ...state, isLoading: false, error: 'ingredients error' });
  });

  it('uses a fallback error for fetchIngredients.rejected without action payload', () => {
    const state = { ...getInitialState(), isLoading: true };

    expect(
      ingredientsSlice.reducer(state, { type: fetchIngredients.rejected.type })
    ).toEqual({
      ...state,
      isLoading: false,
      error: 'Ошибка загрузки ингредиентов',
    });
  });
});
