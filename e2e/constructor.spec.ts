import { fileURLToPath } from 'node:url';

import { expect, test, type Page } from '@playwright/test';

const apiHarPath = fileURLToPath(new URL('./fixtures/api.har', import.meta.url));

const testData = {
  bun: {
    id: 'bun-1',
    name: 'Краторная булка',
  },
  sauce: {
    id: 'sauce-1',
    name: 'Соус Spicy-X',
    calories: 30,
    proteins: 30,
    fat: 20,
    carbohydrates: 40,
  },
  orderNumber: 4242,
} as const;

const browserConsoleIssues = new WeakMap<Page, string[]>();

test.beforeEach(async ({ page }) => {
  const issues: string[] = [];

  browserConsoleIssues.set(page, issues);
  page.on('console', (message) => {
    if (message.type() === 'error' || message.type() === 'warning') {
      issues.push(message.text());
    }
  });
  page.on('pageerror', (error) => issues.push(error.message));

  await page.routeFromHAR(apiHarPath, {
    url: '**/api/**',
    update: false,
    notFound: 'abort',
  });
});

test.afterEach(({ page }) => {
  expect(browserConsoleIssues.get(page)).toEqual([]);
});

test('adds a bun and a filling to the burger constructor with drag and drop', async ({
  page,
}) => {
  await page.goto('/');

  const constructor = page.getByTestId('burger-constructor');
  const bunCard = page.getByTestId(`ingredient-card-${testData.bun.id}`);
  const sauceCard = page.getByTestId(`ingredient-card-${testData.sauce.id}`);

  await bunCard.dragTo(constructor);

  await expect(
    constructor.getByText(`${testData.bun.name} (верх)`, { exact: true })
  ).toBeVisible();
  await expect(
    constructor.getByText(`${testData.bun.name} (низ)`, { exact: true })
  ).toBeVisible();

  await sauceCard.dragTo(constructor);

  await expect(
    constructor.getByText(testData.sauce.name, { exact: true })
  ).toBeVisible();
});

test('opens ingredient details and closes the modal with the close button', async ({
  page,
}) => {
  await page.goto('/');

  const sauceCard = page.getByTestId(`ingredient-card-${testData.sauce.id}`);

  await sauceCard.getByRole('button').click();

  const modal = page.getByTestId('modal');
  const calories = modal.getByText('Калории, ккал').locator('..');
  const proteins = modal.getByText('Белки, г').locator('..');
  const fat = modal.getByText('Жиры, г').locator('..');
  const carbohydrates = modal.getByText('Углеводы, г').locator('..');

  await expect(modal).toBeVisible();
  await expect(modal.getByText(testData.sauce.name, { exact: true })).toBeVisible();
  await expect(
    calories.getByText(String(testData.sauce.calories), { exact: true })
  ).toBeVisible();
  await expect(
    proteins.getByText(String(testData.sauce.proteins), { exact: true })
  ).toBeVisible();
  await expect(fat.getByText(String(testData.sauce.fat), { exact: true })).toBeVisible();
  await expect(
    carbohydrates.getByText(String(testData.sauce.carbohydrates), { exact: true })
  ).toBeVisible();

  await page.getByTestId('modal-close').click();

  await expect(modal).toBeHidden();
});

test('creates an authenticated order and closes the order details modal', async ({
  page,
}) => {
  await page.addInitScript(() => {
    localStorage.setItem('accessToken', 'Bearer test-access-token');
  });

  const userResponse = page.waitForResponse('**/api/auth/user');

  await page.goto('/');
  await userResponse;

  const constructor = page.getByTestId('burger-constructor');
  const bunCard = page.getByTestId(`ingredient-card-${testData.bun.id}`);
  const sauceCard = page.getByTestId(`ingredient-card-${testData.sauce.id}`);

  await bunCard.dragTo(constructor);
  await sauceCard.dragTo(constructor);

  const orderButton = page
    .getByTestId('order-button')
    .getByRole('button', { name: 'Оформить заказ' });

  await expect(orderButton).toBeEnabled();
  await orderButton.click();

  const modal = page.getByTestId('modal');

  await expect(modal).toBeVisible();
  await expect(
    modal.getByText(String(testData.orderNumber), { exact: true })
  ).toBeVisible();

  await page.getByTestId('modal-close').click();

  await expect(modal).toBeHidden();
});
