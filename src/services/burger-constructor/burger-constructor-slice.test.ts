import { describe, expect, it } from 'vitest';

import { replacementBun, testBun, testMain, testSauce } from '../test-fixtures';
import {
  addConstructorIngredient,
  burgerConstructorSlice,
  clearConstructor,
  moveConstructorIngredient,
  removeConstructorIngredient,
  type TConstructorIngredient,
} from './burger-constructor-slice';

type TBurgerConstructorState = ReturnType<typeof burgerConstructorSlice.reducer>;

const getInitialState = (): TBurgerConstructorState =>
  burgerConstructorSlice.reducer(undefined, { type: 'unknown' });

const withConstructorId = (
  ingredient: typeof testSauce,
  constructorId: string
): TConstructorIngredient => ({ ...ingredient, constructorId });

describe('burgerConstructorSlice', () => {
  it('returns the initial state', () => {
    expect(getInitialState()).toEqual({ bun: null, ingredients: [] });
  });

  it('adds a bun and creates a constructorId', () => {
    const action = addConstructorIngredient(testBun);
    const state = burgerConstructorSlice.reducer(getInitialState(), action);

    expect(action.payload.constructorId).toEqual(expect.any(String));
    expect(action.payload.constructorId).not.toHaveLength(0);
    expect(state.bun).toEqual(action.payload);
    expect(state.ingredients).toEqual([]);
  });

  it('replaces an existing bun', () => {
    const stateWithBun = burgerConstructorSlice.reducer(
      getInitialState(),
      addConstructorIngredient(testBun)
    );
    const action = addConstructorIngredient(replacementBun);
    const state = burgerConstructorSlice.reducer(stateWithBun, action);

    expect(action.payload.constructorId).toEqual(expect.any(String));
    expect(action.payload.constructorId).not.toHaveLength(0);
    expect(state.bun).toEqual(action.payload);
    expect(state.ingredients).toEqual([]);
  });

  it('adds a regular ingredient and creates a constructorId', () => {
    const action = addConstructorIngredient(testSauce);
    const state = burgerConstructorSlice.reducer(getInitialState(), action);

    expect(action.payload.constructorId).toEqual(expect.any(String));
    expect(action.payload.constructorId).not.toHaveLength(0);
    expect(state.bun).toBeNull();
    expect(state.ingredients).toHaveLength(1);
    expect(state.ingredients[0]).toEqual(expect.objectContaining(testSauce));
    expect(state.ingredients[0]?.constructorId).toEqual(expect.any(String));
  });

  it('removes a constructor ingredient by constructorId', () => {
    const firstIngredient = withConstructorId(testSauce, 'first');
    const secondIngredient: TConstructorIngredient = {
      ...testMain,
      constructorId: 'second',
    };
    const state = burgerConstructorSlice.reducer(
      { bun: null, ingredients: [firstIngredient, secondIngredient] },
      removeConstructorIngredient(firstIngredient.constructorId)
    );

    expect(state.ingredients).toEqual([secondIngredient]);
  });

  it('moves a constructor ingredient', () => {
    const firstIngredient = withConstructorId(testSauce, 'first');
    const secondIngredient: TConstructorIngredient = {
      ...testMain,
      constructorId: 'second',
    };
    const state = burgerConstructorSlice.reducer(
      { bun: null, ingredients: [firstIngredient, secondIngredient] },
      moveConstructorIngredient({ fromIndex: 0, toIndex: 1 })
    );

    expect(state.ingredients).toEqual([secondIngredient, firstIngredient]);
  });

  it('clears the constructor', () => {
    const state = burgerConstructorSlice.reducer(
      {
        bun: testBun,
        ingredients: [withConstructorId(testSauce, 'sauce')],
      },
      clearConstructor()
    );

    expect(state).toEqual(getInitialState());
  });
});
