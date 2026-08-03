# Stellar Burger

Интерактивный конструктор бургеров на React и TypeScript с drag-and-drop, управлением состоянием через Redux Toolkit, маршрутизацией и Playwright smoke-тестом основного экрана.

## Основные возможности

- сборка заказа из ингредиентов с drag-and-drop;
- управление состоянием через Redux Toolkit;
- маршрутизация и модальные сценарии;
- адаптивный интерфейс;
- end-to-end smoke-тест с mock API;
- автоматические проверки кода перед коммитом.

## Стек

- React 19;
- TypeScript;
- Redux Toolkit и React Redux;
- React Router;
- React DnD;
- Vite;
- Vitest и Testing Library настроены как test stack; unit-тесты пока не добавлены;
- Playwright;
- ESLint, Stylelint и Prettier;
- Husky и lint-staged.

## Качество кода

Проект использует строгую типизацию TypeScript, линтинг JavaScript/TypeScript и CSS, форматирование Prettier, а также проверки перед коммитом.

```bash
npm run check
npm run e2e
npm run build
```

`npm run test` запускает Vitest в watch-режиме, однако test suite для Vitest в текущей версии отсутствует. Playwright покрывает smoke-сценарий загрузки конструктора с mock-ответом API.

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

## Архитектура

- Redux Toolkit хранит ингредиенты, состояние конструктора, пользователя и заказы;
- React DnD отвечает за добавление и перестановку ингредиентов;
- React Router разделяет каталог, ленту заказов, профиль и модальные сценарии;
- API-вызовы и обновление токена вынесены в сервисный слой;
- Playwright изолирует внешний API через mock-ответ в smoke-тесте.

## Статус

Учебный проект, используемый как демонстрация современного React-стека, управления состоянием, drag-and-drop и базового end-to-end тестирования.
