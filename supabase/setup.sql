-- ============================================================
-- Gainward — Supabase setup script
-- Run this once in the Supabase SQL Editor (Dashboard → SQL Editor → New query)
-- ============================================================

-- ---------- food_logs ----------
create table public.food_logs (
  id uuid primary key default gen_random_uuid(),
  device_id uuid not null,
  food_name text not null,
  quantity numeric not null,
  unit text not null,
  eat_date_time timestamptz not null,
  photo_path text,                 -- path inside the 'photos' storage bucket, null if no photo
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index food_logs_device_id_idx on public.food_logs (device_id);
create index food_logs_eat_date_time_idx on public.food_logs (eat_date_time desc);

-- ---------- weight_logs ----------
create table public.weight_logs (
  id uuid primary key default gen_random_uuid(),
  device_id uuid not null,
  weight numeric not null,
  record_date timestamptz not null default now()
);

create index weight_logs_device_id_idx on public.weight_logs (device_id);
create index weight_logs_record_date_idx on public.weight_logs (record_date desc);

-- ---------- settings (one row per device) ----------
create table public.settings (
  device_id uuid primary key,
  target_weight numeric,
  theme text not null default 'system',
  favorite_foods text[] not null default '{}'
);

-- ============================================================
-- Row Level Security
--
-- There is no Supabase Auth/login in this app (by design — see chat).
-- Without auth there's no JWT to check, so these policies allow the
-- 'anon' role to read/write any row — protection instead relies on the
-- app always filtering/scoping queries by device_id (a random UUID
-- generated on-device and never displayed or shared).
--
-- This is "security by obscurity": fine for a private single-user app,
-- NOT fine if you ever let other people use this same Supabase project.
-- ============================================================

alter table public.food_logs enable row level security;
alter table public.weight_logs enable row level security;
alter table public.settings enable row level security;

create policy "anon full access" on public.food_logs
  for all to anon using (true) with check (true);

create policy "anon full access" on public.weight_logs
  for all to anon using (true) with check (true);

create policy "anon full access" on public.settings
  for all to anon using (true) with check (true);

-- ============================================================
-- Storage bucket for food photos
-- ============================================================

insert into storage.buckets (id, name, public)
values ('photos', 'photos', true)
on conflict (id) do nothing;

-- Public bucket: anyone with the file URL can view (fine for photos of food).
-- Upload/delete still goes through these policies on storage.objects.
create policy "anon upload photos" on storage.objects
  for insert to anon
  with check (bucket_id = 'photos');

create policy "anon delete own photos" on storage.objects
  for delete to anon
  using (bucket_id = 'photos');

create policy "anyone can view photos" on storage.objects
  for select to anon
  using (bucket_id = 'photos');
