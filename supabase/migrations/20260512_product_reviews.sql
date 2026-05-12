create table if not exists public.product_reviews (
  id uuid primary key default gen_random_uuid(),
  product_id text not null,
  product_name text not null,
  user_id uuid references auth.users(id) on delete set null,
  reviewer_name text not null,
  reviewer_email text,
  rating integer not null check (rating between 1 and 5),
  comment text not null,
  status text not null default 'approved',
  created_at timestamptz not null default now()
);

create index if not exists product_reviews_product_id_idx
on public.product_reviews (product_id, created_at desc);

create index if not exists product_reviews_status_created_idx
on public.product_reviews (status, created_at desc);

alter table public.product_reviews enable row level security;

drop policy if exists "Approved reviews are public" on public.product_reviews;
create policy "Approved reviews are public"
on public.product_reviews for select
using (status = 'approved' or public.is_app_admin());

drop policy if exists "Anyone can submit product reviews" on public.product_reviews;
create policy "Anyone can submit product reviews"
on public.product_reviews for insert
with check (
  status = 'approved'
  and rating between 1 and 5
  and length(trim(reviewer_name)) > 0
  and length(trim(comment)) > 0
);

drop policy if exists "Admins manage product reviews" on public.product_reviews;
create policy "Admins manage product reviews"
on public.product_reviews for all
using (public.is_app_admin())
with check (public.is_app_admin());
