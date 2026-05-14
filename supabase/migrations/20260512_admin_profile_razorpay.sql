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
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.app_admins
    where lower(email) = lower(coalesce(auth.jwt() ->> 'email', ''))
  )
  or coalesce(auth.jwt() -> 'app_metadata' ->> 'role', '') = 'admin'
  or coalesce((auth.jwt() -> 'app_metadata' ->> 'is_admin')::boolean, false)
$$;

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text,
  phone text,
  avatar_url text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.addresses (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  recipient_name text,
  phone text,
  address text not null,
  city text,
  pin_code text,
  is_default boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.consultation_requests (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete set null,
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
  user_id uuid references auth.users(id) on delete set null,
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
  razorpay_order_id text unique,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.payments (
  id uuid primary key default gen_random_uuid(),
  order_id uuid references public.orders(id) on delete set null,
  order_number text,
  customer_name text,
  method text not null,
  amount numeric not null default 0,
  currency text not null default 'INR',
  status text not null default 'pending',
  razorpay_order_id text,
  razorpay_payment_id text,
  razorpay_signature text,
  raw_event jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table if exists public.products_by_category
  add column if not exists images text[] default '{}'::text[],
  add column if not exists status text not null default 'active',
  add column if not exists stock_quantity integer,
  add column if not exists featured boolean not null default false;

alter table if exists public.products_by_concern
  add column if not exists images text[] default '{}'::text[];

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists set_profiles_updated_at on public.profiles;
create trigger set_profiles_updated_at
  before update on public.profiles
  for each row execute function public.set_updated_at();

drop trigger if exists set_addresses_updated_at on public.addresses;
create trigger set_addresses_updated_at
  before update on public.addresses
  for each row execute function public.set_updated_at();

drop trigger if exists set_orders_updated_at on public.orders;
create trigger set_orders_updated_at
  before update on public.orders
  for each row execute function public.set_updated_at();

drop trigger if exists set_payments_updated_at on public.payments;
create trigger set_payments_updated_at
  before update on public.payments
  for each row execute function public.set_updated_at();

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, full_name, phone)
  values (
    new.id,
    nullif(new.raw_user_meta_data->>'full_name', ''),
    nullif(new.raw_user_meta_data->>'phone', '')
  )
  on conflict (id) do update
  set full_name = excluded.full_name,
      phone = excluded.phone,
      updated_at = now();

  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

insert into storage.buckets (id, name, public)
values ('product-images', 'product-images', true)
on conflict (id) do update set public = true;

alter table public.app_admins enable row level security;
alter table public.profiles enable row level security;
alter table public.addresses enable row level security;
alter table public.consultation_requests enable row level security;
alter table public.orders enable row level security;
alter table public.payments enable row level security;
alter table if exists public.products_by_category enable row level security;
alter table if exists public.products_by_concern enable row level security;

drop policy if exists "Admins can read app admins" on public.app_admins;
create policy "Admins can read app admins"
on public.app_admins for select
using (public.is_app_admin());

drop policy if exists "Profiles are readable by owner or admin" on public.profiles;
create policy "Profiles are readable by owner or admin"
on public.profiles for select
using (auth.uid() = id or public.is_app_admin());

drop policy if exists "Profiles are insertable by owner" on public.profiles;
create policy "Profiles are insertable by owner"
on public.profiles for insert
with check (auth.uid() = id);

drop policy if exists "Profiles are updatable by owner or admin" on public.profiles;
create policy "Profiles are updatable by owner or admin"
on public.profiles for update
using (auth.uid() = id or public.is_app_admin())
with check (auth.uid() = id or public.is_app_admin());

drop policy if exists "Addresses readable by owner or admin" on public.addresses;
create policy "Addresses readable by owner or admin"
on public.addresses for select
using (auth.uid() = user_id or public.is_app_admin());

drop policy if exists "Addresses manageable by owner or admin" on public.addresses;
create policy "Addresses manageable by owner or admin"
on public.addresses for all
using (auth.uid() = user_id or public.is_app_admin())
with check (auth.uid() = user_id or public.is_app_admin());

drop policy if exists "Anyone can create consultations" on public.consultation_requests;
create policy "Anyone can create consultations"
on public.consultation_requests for insert
with check (true);

drop policy if exists "Consultations readable by owner or admin" on public.consultation_requests;
create policy "Consultations readable by owner or admin"
on public.consultation_requests for select
using (auth.uid() = user_id or public.is_app_admin());

drop policy if exists "Admins manage consultations" on public.consultation_requests;
create policy "Admins manage consultations"
on public.consultation_requests for update
using (public.is_app_admin())
with check (public.is_app_admin());

drop policy if exists "Orders readable by owner or admin" on public.orders;
create policy "Orders readable by owner or admin"
on public.orders for select
using (auth.uid() = user_id or public.is_app_admin());

drop policy if exists "Anyone can create orders" on public.orders;
create policy "Anyone can create orders"
on public.orders for insert
with check (true);

drop policy if exists "Admins manage orders" on public.orders;
create policy "Admins manage orders"
on public.orders for update
using (public.is_app_admin())
with check (public.is_app_admin());

drop policy if exists "Payments readable by owner or admin" on public.payments;
create policy "Payments readable by owner or admin"
on public.payments for select
using (
  public.is_app_admin()
  or exists (
    select 1 from public.orders
    where orders.id = payments.order_id
    and orders.user_id = auth.uid()
  )
);

drop policy if exists "Anyone can create payments" on public.payments;
create policy "Anyone can create payments"
on public.payments for insert
with check (true);

drop policy if exists "Admins manage payments" on public.payments;
create policy "Admins manage payments"
on public.payments for update
using (public.is_app_admin())
with check (public.is_app_admin());

drop policy if exists "Products are public" on public.products_by_category;
create policy "Products are public"
on public.products_by_category for select
using (coalesce(status, 'active') = 'active' or public.is_app_admin());

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

drop policy if exists "Product images are public" on storage.objects;
create policy "Product images are public"
on storage.objects for select
using (bucket_id = 'product-images');

drop policy if exists "Admins upload product images" on storage.objects;
create policy "Admins upload product images"
on storage.objects for insert
with check (bucket_id = 'product-images' and public.is_app_admin());

drop policy if exists "Admins update product images" on storage.objects;
create policy "Admins update product images"
on storage.objects for update
using (bucket_id = 'product-images' and public.is_app_admin())
with check (bucket_id = 'product-images' and public.is_app_admin());

drop policy if exists "Admins delete product images" on storage.objects;
create policy "Admins delete product images"
on storage.objects for delete
using (bucket_id = 'product-images' and public.is_app_admin());
