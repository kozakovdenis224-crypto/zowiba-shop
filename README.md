# ZOWIBA.SHOP

Готовий каркас магазину цифрових товарів на Next.js 16 + Supabase.

## Крок 1. Встановлення

```bash
npm install
```

## Крок 2. Створи проєкт у Supabase

1. Зайди на https://supabase.com → New project.
2. У розділі **Project Settings → API** скопіюй:
   - `Project URL`
   - `anon public` ключ
3. Створи файл `.env.local` в корені проєкту (скопіюй `.env.local.example`) і встав туди свої значення:

```
NEXT_PUBLIC_SUPABASE_URL=https://ваш-проєкт.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...
```

## Крок 3. SQL — таблиці, RLS, тригер

Відкрий у Supabase **SQL Editor** і встав повністю цей скрипт, натисни Run:

```sql
-- Таблиця товарів
create table if not exists products (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  description text,
  price numeric not null default 0,
  image text,
  category text,
  telegram_link text,
  visible boolean not null default true,
  created_at timestamptz not null default now()
);

-- Таблиця налаштувань сайту (один рядок з id = 1)
create table if not exists site_settings (
  id int primary key default 1,
  shop_name text default 'ZOWIBA.SHOP',
  logo_url text,
  telegram_url text default 'https://t.me/zowiba',
  hero_title text default 'Цифрові товари нового покоління',
  hero_subtitle text default 'Софт, автоматизація та інструменти — швидко, надійно.',
  banner_url text,
  contacts text,
  updated_at timestamptz default now()
);

insert into site_settings (id) values (1) on conflict (id) do nothing;

-- Увімкнути RLS
alter table products enable row level security;
alter table site_settings enable row level security;

-- Публічний доступ на читання лише видимих товарів
create policy "public_read_visible_products"
on products for select
using (visible = true);

-- Повний доступ для авторизованих (адмін) користувачів
create policy "authenticated_full_access_products"
on products for all
using (auth.role() = 'authenticated')
with check (auth.role() = 'authenticated');

-- Налаштування сайту: читати можуть всі, редагувати — лише авторизовані
create policy "public_read_settings"
on site_settings for select
using (true);

create policy "authenticated_update_settings"
on site_settings for all
using (auth.role() = 'authenticated')
with check (auth.role() = 'authenticated');
```

## Крок 4. Storage (зображення товарів)

1. У Supabase зайди в **Storage** → **New bucket**.
2. Назва бакета: `products`. Зроби його **Public**.
3. У **Storage → Policies** для бакета `products` додай:
   - Policy на `SELECT` — `true` (публічний перегляд).
   - Policy на `INSERT`/`UPDATE` — `auth.role() = 'authenticated'` (тільки адмін може завантажувати).

## Крок 5. Створи свій адмін-акаунт

1. У Supabase зайди в **Authentication → Users → Add user**.
2. Введи свій email і пароль — саме ними будеш логінитись на `/admin`.
3. **Authentication → Providers** переконайся, що ввімкнено Email/Password, а Email confirmation можна вимкнути для простоти (Auth → Settings).

## Крок 6. Запуск

```bash
npm run dev
```

Відкрий:
- `http://localhost:3000` — головна сторінка магазину
- `http://localhost:3000/admin/login` — вхід в адмінку (посилання на неї ніде на сайті не показується)

## Структура проєкту

```
app/
  page.tsx                    -> головна сторінка (Header + Hero + сітка товарів)
  layout.tsx                  -> кореневий layout
  globals.css                 -> темна тема, glass-ефекти, кольори
  admin/
    login/page.tsx            -> вхід в адмінку
    page.tsx                  -> Dashboard (кількість товарів, останні зміни)
    products/page.tsx         -> список товарів (edit/hide/delete)
    products/new/page.tsx     -> додати товар
    products/[id]/edit/page.tsx -> редагувати товар
    settings/page.tsx         -> назва магазину, лого, telegram, hero, банер
  actions/
    products.ts                -> server actions: create/update/delete/upload
    settings.ts                -> server actions для налаштувань
components/
  Header.tsx, Hero.tsx, ProductCard.tsx, ProductGrid.tsx
  admin/                       -> AdminSidebar, ProductForm, SettingsForm, і т.д.
lib/
  types.ts                     -> типи Product, SiteSettings
  supabase/                    -> client.ts, server.ts, middleware.ts
middleware.ts                  -> захищає /admin (редірект на /admin/login без сесії)
```

## Як додати нову категорію товарів у майбутньому (наприклад, VPN/Proxy/ключі)

Нічого міняти в коді не треба — просто додай товар через `/admin/products/new` і вкажи
потрібну категорію в полі "Категорія". Категорія — звичайний текст, картки автоматично
покажуть його як бейдж.

## Що можна легко додати далі (архітектура вже готова під це)

- Пошук і фільтр по категоріях — окремий client component над `ProductGrid`.
- Сторінка товару `/product/[id]` — новий route, дані ті ж самі з таблиці `products`.
- Промокоди / знижки — нова таблиця `promo_codes`, підключається окремим action.
- Оплата карткою/крипто — окремий провайдер (Stripe / NOWPayments), не чіпає існуючі таблиці.
- Особистий кабінет — Supabase Auth вже підключено, залишиться додати публічну реєстрацію
  користувачів (зараз auth використовується тільки для адміна).

---

**Важливо:** товар "TG Sender" в описі магазину варто підписати чесно, наприклад
"Remote PC Control — керування ПК з телефону через Telegram", щоб не було плутанини
з масовими Telegram-розсилками (спам-інструментами), які заборонені правилами Telegram
і можуть порушувати закон про захист персональних даних.
