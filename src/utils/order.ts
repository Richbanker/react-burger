import type { TIngredient, TOrderStatus } from './types';

const DAY_IN_MILLISECONDS = 24 * 60 * 60 * 1000;

const getDayWord = (days: number): string => {
  const lastTwoDigits = days % 100;
  const lastDigit = days % 10;

  if (lastTwoDigits >= 11 && lastTwoDigits <= 14) {
    return 'дней';
  }

  if (lastDigit === 1) {
    return 'день';
  }

  if (lastDigit >= 2 && lastDigit <= 4) {
    return 'дня';
  }

  return 'дней';
};

export const getOrderStatusText = (status: TOrderStatus): string => {
  const statusLabels: Record<TOrderStatus, string> = {
    created: 'Создан',
    pending: 'Готовится',
    done: 'Выполнен',
  };

  return statusLabels[status];
};

export const formatOrderDate = (dateString: string): string => {
  const date = new Date(dateString);

  if (Number.isNaN(date.getTime())) {
    return '';
  }

  const now = new Date();
  const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const startOfDate = new Date(date.getFullYear(), date.getMonth(), date.getDate());
  const dayDifference = Math.round(
    (startOfToday.getTime() - startOfDate.getTime()) / DAY_IN_MILLISECONDS
  );

  let dayLabel: string;

  if (dayDifference === 0) {
    dayLabel = 'Сегодня';
  } else if (dayDifference === 1) {
    dayLabel = 'Вчера';
  } else {
    dayLabel = `${dayDifference} ${getDayWord(dayDifference)} назад`;
  }

  const time = new Intl.DateTimeFormat('ru-RU', {
    hour: '2-digit',
    minute: '2-digit',
    timeZoneName: 'short',
  }).format(date);

  return `${dayLabel}, ${time}`;
};

export const getOrderIngredients = (
  ingredientIds: string[],
  ingredients: TIngredient[]
): TIngredient[] => {
  const ingredientMap = new Map(
    ingredients.map((ingredient) => [ingredient._id, ingredient])
  );

  return ingredientIds.flatMap((id) => {
    const ingredient = ingredientMap.get(id);
    return ingredient ? [ingredient] : [];
  });
};

export const getOrderPrice = (
  ingredientIds: string[],
  ingredients: TIngredient[]
): number =>
  getOrderIngredients(ingredientIds, ingredients).reduce(
    (total, ingredient) => total + ingredient.price,
    0
  );
