# Stellar Burger

Интерактивный конструктор бургеров на React и TypeScript с drag-and-drop, управлением состоянием через Redux Toolkit, маршрутизацией и автоматизированными тестами.

## Основные возможности

- сборка заказа из ингредиентов с drag-and-drop;
- управление состоянием через Redux Toolkit;
- маршрутизация и модальные сценарии;
- адаптивный интерфейс;
- unit- и компонентные тесты;
- end-to-end тестирование пользовательских сценариев;
- автоматические проверки кода перед коммитом.

## Стек

- React 19;
- TypeScript;
- Redux Toolkit и React Redux;
- React Router;
- React DnD;
- Vite;
- Vitest;
- Testing Library;
- Playwright;
- ESLint, Stylelint и Prettier;
- Husky и lint-staged.

## Качество кода

Проект использует строгую типизацию TypeScript, линтинг JavaScript/TypeScript и CSS, форматирование Prettier, а также проверки перед коммитом.

```bash
npm run check
npm run test
npm run e2e
```

## Локальный запуск

```bash
git clone https://github.com/Richbanker/react-burger.git
cd react-burger
npm install
npm run dev
```

## Сборка

```bash
npm run build
npm run preview
```

## Структура проекта

Основной код расположен в `src`. Компоненты интерфейса, страницы, Redux-логика, утилиты и тесты разделены по зонам ответственности.

## Статус

Проект развивается в рамках учебной программы по frontend-разработке и используется как демонстрация работы с современным React-стеком, управлением состоянием и тестированием.
