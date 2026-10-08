import { describe, expect, it } from 'vitest';
import { getOrderIngredients, getOrderPrice, getOrderStatusText, formatOrderDate } from './order';
import type { TIngredient } from './types';

const ingredient = (id: string, price: number): TIngredient => ({
  _id: id,
  name: id,
  type: 'main',
  proteins: 0,
  fat: 0,
  carbohydrates: 0,
  calories: 0,
  price,
  image: '',
  image_mobile: '',
  image_large: '',
  __v: 0,
});

describe('утилиты заказа', () => {
  const ingredients = [ingredient('a', 100), ingredient('b', 50)];

  it('сохраняет порядок и повторы ингредиентов', () => {
    expect(getOrderIngredients(['b', 'a', 'b'], ingredients)).toEqual([
      ingredients[1], ingredients[0], ingredients[1],
    ]);
  });

  it('пропускает неизвестные идентификаторы', () => {
    expect(getOrderIngredients(['missing', 'a'], ingredients)).toEqual([ingredients[0]]);
  });

  it('возвращает пустой список для пустого заказа', () => {
    expect(getOrderIngredients([], ingredients)).toEqual([]);
  });

  it('суммирует цены с учётом повторов', () => {
    expect(getOrderPrice(['a', 'b', 'a'], ingredients)).toBe(250);
  });

  it('не учитывает неизвестные ингредиенты в цене', () => {
    expect(getOrderPrice(['missing', 'b'], ingredients)).toBe(50);
  });

  it('возвращает ноль для пустого заказа', () => {
    expect(getOrderPrice([], ingredients)).toBe(0);
  });

  it.each([
    ['created', 'Создан'],
    ['pending', 'Готовится'],
    ['done', 'Выполнен'],
  ] as const)('переводит статус %s', (status, label) => {
    expect(getOrderStatusText(status)).toBe(label);
  });

  it('возвращает пустую строку для некорректной даты', () => {
    expect(formatOrderDate('not-a-date')).toBe('');
  });
});
