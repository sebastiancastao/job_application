create extension if not exists pgcrypto;

create table if not exists public.job_offers (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  location text not null,
  employment_type text not null,
  compensation text,
  summary text not null,
  is_published boolean not null default true,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create index if not exists job_offers_published_created_at_idx
  on public.job_offers (is_published, created_at desc);

create or replace function public.set_job_offers_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = timezone('utc', now());
  return new;
end;
$$;

drop trigger if exists set_job_offers_updated_at on public.job_offers;

create trigger set_job_offers_updated_at
before update on public.job_offers
for each row
execute function public.set_job_offers_updated_at();

alter table public.job_offers enable row level security;

drop policy if exists "Public can read published job offers" on public.job_offers;

create policy "Public can read published job offers"
on public.job_offers
for select
to anon, authenticated
using (is_published = true);
