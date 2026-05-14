create extension if not exists pgcrypto;

create table if not exists public.app_admins (
  email text primary key,
  created_at timestamptz not null default now()
);

insert into public.app_admins (email)
values ('yuvedalife2008@gmail.com')
on conflict (email) do nothing;

create or replace function public.is_app_admin()
returns boolean
language sql
stable
as $$
  select exists (
    select 1
    from public.app_admins
    where lower(email) = lower(coalesce(auth.jwt() ->> 'email', ''))
  )
  or coalesce(auth.jwt() -> 'app_metadata' ->> 'role', '') = 'admin'
  or coalesce((auth.jwt() -> 'app_metadata' ->> 'is_admin')::boolean, false)
$$;

create table if not exists public.consultation_requests (
  id uuid primary key default gen_random_uuid(),
  full_name text not null,
  age integer,
  gender text,
  health_concern text,
  condition_details text,
  preferred_date date,
  preferred_time text,
  status text not null default 'pending',
  created_at timestamptz not null default now()
);

create table if not exists public.orders (
  id uuid primary key default gen_random_uuid(),
  order_number text not null unique,
  customer_name text not null,
  phone text,
  email text,
  address text,
  city text,
  pin_code text,
  items jsonb not null default '[]'::jsonb,
  payment_method text not null default 'cod',
  payment_status text not null default 'pending',
  order_status text not null default 'placed',
  subtotal numeric not null default 0,
  tax numeric not null default 0,
  total numeric not null default 0,
  created_at timestamptz not null default now()
);

create table if not exists public.payments (
  id uuid primary key default gen_random_uuid(),
  order_id uuid references public.orders(id) on delete set null,
  order_number text,
  customer_name text,
  method text not null,
  amount numeric not null default 0,
  status text not null default 'pending',
  created_at timestamptz not null default now()
);

alter table public.app_admins enable row level security;
alter table public.consultation_requests enable row level security;
alter table public.orders enable row level security;
alter table public.payments enable row level security;

drop policy if exists "Admins can read app admins" on public.app_admins;
create policy "Admins can read app admins"
on public.app_admins for select
using (public.is_app_admin());

drop policy if exists "Anyone can create consultations" on public.consultation_requests;
create policy "Anyone can create consultations"
on public.consultation_requests for insert
with check (true);

drop policy if exists "Admins manage consultations" on public.consultation_requests;
create policy "Admins manage consultations"
on public.consultation_requests for all
using (public.is_app_admin())
with check (public.is_app_admin());

drop policy if exists "Anyone can create orders" on public.orders;
create policy "Anyone can create orders"
on public.orders for insert
with check (true);

drop policy if exists "Admins manage orders" on public.orders;
create policy "Admins manage orders"
on public.orders for all
using (public.is_app_admin())
with check (public.is_app_admin());

drop policy if exists "Anyone can create payments" on public.payments;
create policy "Anyone can create payments"
on public.payments for insert
with check (true);

drop policy if exists "Admins manage payments" on public.payments;
create policy "Admins manage payments"
on public.payments for all
using (public.is_app_admin())
with check (public.is_app_admin());

alter table if exists public.products_by_category enable row level security;
alter table if exists public.products_by_concern enable row level security;

drop policy if exists "Products are public" on public.products_by_category;
create policy "Products are public"
on public.products_by_category for select
using (true);

drop policy if exists "Admins manage category products" on public.products_by_category;
create policy "Admins manage category products"
on public.products_by_category for all
using (public.is_app_admin())
with check (public.is_app_admin());

drop policy if exists "Concern products are public" on public.products_by_concern;
create policy "Concern products are public"
on public.products_by_concern for select
using (true);

drop policy if exists "Admins manage concern products" on public.products_by_concern;
create policy "Admins manage concern products"
on public.products_by_concern for all
using (public.is_app_admin())
with check (public.is_app_admin());
