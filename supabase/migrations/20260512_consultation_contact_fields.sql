alter table public.consultation_requests
  add column if not exists phone text,
  add column if not exists email text;
