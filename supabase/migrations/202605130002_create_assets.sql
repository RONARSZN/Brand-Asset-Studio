create table if not exists public.assets (
  id uuid primary key default gen_random_uuid(),
  brand_id uuid references public.brands(id) on delete cascade,
  asset_type text not null,
  file_url text not null,
  original_filename text not null,
  created_at timestamp with time zone default now()
);

insert into storage.buckets (id, name, public)
values ('assets', 'assets', true)
on conflict (id) do update set public = excluded.public;

do $$
begin
  if not exists (
    select 1 from pg_policies
    where schemaname = 'storage' and tablename = 'objects'
    and policyname = 'Public read access for assets'
  ) then
    create policy "Public read access for assets"
    on storage.objects for select
    using (bucket_id = 'assets');
  end if;

  if not exists (
    select 1 from pg_policies
    where schemaname = 'storage' and tablename = 'objects'
    and policyname = 'Authenticated write access for assets'
  ) then
    create policy "Authenticated write access for assets"
    on storage.objects for insert
    to authenticated
    with check (bucket_id = 'assets');
  end if;

  if not exists (
    select 1 from pg_policies
    where schemaname = 'storage' and tablename = 'objects'
    and policyname = 'Authenticated delete access for assets'
  ) then
    create policy "Authenticated delete access for assets"
    on storage.objects for delete
    to authenticated
    using (bucket_id = 'assets');
  end if;
end $$;
