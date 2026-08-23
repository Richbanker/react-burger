import { describe, expect, it } from 'vitest';

import { testSauce } from '../test-fixtures';
import {
  clearCurrentIngredient,
  currentIngredientSlice,
  setCurrentIngredient,
} from './current-ingredient-slice';

describe('currentIngredientSlice', () => {
  it('returns the initial state', () => {
    expect(currentIngredientSlice.reducer(undefined, { type: 'unknown' })).toEqual({
      item: null,
    });
  });

  it('sets the current ingredient', () => {
    expect(
      currentIngredientSlice.reducer(undefined, setCurrentIngredient(testSauce))
    ).toEqual({ item: testSauce });
  });

  it('clears the current ingredient', () => {
    expect(
      currentIngredientSlice.reducer({ item: testSauce }, clearCurrentIngredient())
    ).toEqual({ item: null });
  });
});
