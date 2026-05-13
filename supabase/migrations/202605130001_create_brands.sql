create extension if not exists "pgcrypto";

create table if not exists public.brands (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  created_at timestamp with time zone default now()
);
