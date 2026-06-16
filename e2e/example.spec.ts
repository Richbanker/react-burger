import { expect, test } from '@playwright/test';

const ingredients = [
  {
    _id: 'bun-1',
    name: 'Краторная булка',
    type: 'bun',
    proteins: 80,
    fat: 24,
    carbohydrates: 53,
    calories: 420,
    price: 1255,
    image: '/logo.svg',
    image_mobile: '/logo.svg',
    image_large: '/logo.svg',
    __v: 0,
  },
  {
    _id: 'sauce-1',
    name: 'Соус Spicy-X',
    type: 'sauce',
    proteins: 30,
    fat: 20,
    carbohydrates: 40,
    calories: 30,
    price: 90,
    image: '/logo.svg',
    image_mobile: '/logo.svg',
    image_large: '/logo.svg',
    __v: 0,
  },
  {
    _id: 'main-1',
    name: 'Биокотлета',
    type: 'main',
    proteins: 420,
    fat: 142,
    carbohydrates: 242,
    calories: 4242,
    price: 424,
    image: '/logo.svg',
    image_mobile: '/logo.svg',
    image_large: '/logo.svg',
    __v: 0,
  },
] as const;

test('shows burger constructor with mocked ingredients', async ({ page }) => {
  await page.route('**/api/ingredients', async (route) => {
    await route.fulfill({
      json: {
        success: true,
        data: ingredients,
      },
    });
  });

  await page.goto('/');

  await expect(page.getByText('Соберите бургер')).toBeVisible();
  await expect(page.getByRole('heading', { name: 'Булки' })).toBeVisible();
  await expect(page.getByText('Краторная булка')).toBeVisible();
});
