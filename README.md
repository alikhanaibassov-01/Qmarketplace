# Qmarketplace — учебная витрина

Простой маркетплейс на **Next.js (App Router)** + **Prisma** + **PostgreSQL** (например **Neon**). Главная — сразу каталог товаров. Админка по адресу `/admin` (вход по паролю из переменных окружения).

## Локальный запуск

1. Скопируйте переменные окружения:

   ```bash
   cp .env.example .env
   ```

2. Укажите рабочий `DATABASE_URL` (Neon, Vercel Postgres или локальный Postgres).

3. Установите зависимости и примените миграции:

   ```bash
   npm install
   npx prisma migrate dev
   ```

4. (Необязательно) Загрузите демо-товары:

   ```bash
   npx prisma db seed
   ```

5. Запустите dev-сервер:

   ```bash
   npm run dev
   ```

Откройте [http://localhost:3000](http://localhost:3000) — витрина. Админка: [http://localhost:3000/admin/login](http://localhost:3000/admin/login).

## Переменные окружения

| Переменная | Назначение |
|------------|------------|
| `DATABASE_URL` | Строка подключения PostgreSQL |
| `ADMIN_PASSWORD` | Пароль для входа в админку |
| `ADMIN_SESSION_SECRET` | Секрет для подписи cookie сессии (длинная случайная строка) |

## Деплой на Vercel

1. Создайте проект БД (например [Neon](https://neon.tech)) и скопируйте `DATABASE_URL`.
2. Подключите репозиторий к Vercel.
3. В **Settings → Environment Variables** добавьте `DATABASE_URL`, `ADMIN_PASSWORD`, `ADMIN_SESSION_SECRET`.
4. Команда сборки по умолчанию: `npm run build` — в ней уже есть **`prisma migrate deploy`** перед `next build`. Нужен доступ к БД **во время сборки** (чтобы миграции применились). Если по политике CI БД недоступна на build, временно замените скрипт `build` на `prisma generate && next build` и выполняйте миграции отдельным шагом / вручную.
5. После первого деплоя при необходимости выполните сид на проде (локально, указав продовый `DATABASE_URL`): `npx prisma db seed`.

## Структура

- **Витрина:** `/`, `/product/[id]`
- **Админка:** `/admin` (список, поиск), `/admin/products/new`, `/admin/products/[id]`
- **Модель товара:** название, SKU, вес (г), отзывы (количество + средняя оценка + краткий текст), опциональная категория, JSON-характеристики (произвольные пары ключ–значение)

## Скрипты

| Команда | Описание |
|---------|----------|
| `npm run dev` | Разработка |
| `npm run build` | Миграции + production-сборка |
| `npm run db:migrate` | Создание/применение миграций в dev |
| `npm run db:seed` | Демо-данные |
