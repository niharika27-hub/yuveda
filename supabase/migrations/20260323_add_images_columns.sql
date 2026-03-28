-- Add product image URL arrays to both source tables
alter table if exists public.products_by_category
  add column if not exists images text[] default '{}'::text[];

alter table if exists public.products_by_concern
  add column if not exists images text[] default '{}'::text[];

-- Optional: prevent null arrays for easier frontend handling
update public.products_by_category
set images = '{}'::text[]
where images is null;

update public.products_by_concern
set images = '{}'::text[]
where images is null;