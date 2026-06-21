-- Platform updates: upper-left update widget for all users
create table if not exists public.platform_updates (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  body text not null default '',
  image_url text,
  icon_url text,
  is_active boolean not null default true,
  created_by uuid references public.profiles (id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists platform_updates_active_idx
  on public.platform_updates (is_active, created_at desc);

alter table public.platform_updates enable row level security;

drop policy if exists "Anyone can read active platform updates" on public.platform_updates;
create policy "Anyone can read active platform updates"
  on public.platform_updates for select
  using (is_active = true);

drop policy if exists "Admins manage platform updates" on public.platform_updates;
create policy "Admins manage platform updates"
  on public.platform_updates for all
  using (public.is_platform_admin())
  with check (public.is_platform_admin());

-- Storage for update images/icons
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'platform-updates',
  'platform-updates',
  true,
  5242880,
  array['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'image/svg+xml']
)
on conflict (id) do update set
  public = excluded.public,
  file_size_limit = excluded.file_size_limit,
  allowed_mime_types = excluded.allowed_mime_types;

drop policy if exists "Platform update images are public" on storage.objects;
create policy "Platform update images are public"
  on storage.objects for select
  using (bucket_id = 'platform-updates');

drop policy if exists "Admins can upload platform update images" on storage.objects;
create policy "Admins can upload platform update images"
  on storage.objects for insert
  with check (
    bucket_id = 'platform-updates'
    and public.is_platform_admin()
  );

drop policy if exists "Admins can update platform update images" on storage.objects;
create policy "Admins can update platform update images"
  on storage.objects for update
  using (
    bucket_id = 'platform-updates'
    and public.is_platform_admin()
  );

drop policy if exists "Admins can delete platform update images" on storage.objects;
create policy "Admins can delete platform update images"
  on storage.objects for delete
  using (
    bucket_id = 'platform-updates'
    and public.is_platform_admin()
  );

notify pgrst, 'reload schema';
