-- cried.bio v44: Owner/Admin panel foundation
-- Run in Supabase Dashboard → SQL Editor (after v43)

-- ─── Roles & account flags ───
alter table public.profiles
  add column if not exists role text not null default 'user';

alter table public.profiles
  drop constraint if exists profiles_role_check;

alter table public.profiles
  add constraint profiles_role_check
  check (role in ('user', 'admin', 'owner'));

alter table public.profiles
  add column if not exists is_banned boolean not null default false;

alter table public.profiles
  add column if not exists is_disabled boolean not null default false;

alter table public.profiles
  add column if not exists last_login_at timestamptz;

alter table public.profiles
  add column if not exists banned_at timestamptz;

alter table public.profiles
  add column if not exists banned_reason text not null default '';

-- Badge extras
alter table public.badges
  add column if not exists is_hidden boolean not null default false;

alter table public.badges
  add column if not exists is_animated boolean not null default false;

-- ─── Platform settings (singleton) ───
create table if not exists public.platform_settings (
  id int primary key default 1 check (id = 1),
  maintenance_mode boolean not null default false,
  read_only_mode boolean not null default false,
  global_banner text not null default '',
  global_banner_type text not null default 'info',
  force_password_reset boolean not null default false,
  updated_at timestamptz not null default now()
);

insert into public.platform_settings (id) values (1)
on conflict (id) do nothing;

-- ─── Announcements ───
create table if not exists public.announcements (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  body text not null default '',
  announcement_type text not null default 'info',
  is_active boolean not null default true,
  starts_at timestamptz,
  ends_at timestamptz,
  created_by uuid references public.profiles (id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint announcements_type_check
    check (announcement_type in ('info', 'warning', 'update', 'maintenance'))
);

create index if not exists announcements_active_idx
  on public.announcements (is_active, starts_at, ends_at);

-- ─── Admin notifications ───
create table if not exists public.admin_notifications (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references public.profiles (id) on delete cascade,
  title text not null,
  body text not null default '',
  is_read boolean not null default false,
  created_by uuid references public.profiles (id) on delete set null,
  created_at timestamptz not null default now()
);

create index if not exists admin_notifications_user_idx
  on public.admin_notifications (user_id, created_at desc);

-- ─── User timeline ───
create table if not exists public.user_timeline_events (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles (id) on delete cascade,
  event_type text not null,
  title text not null,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create index if not exists user_timeline_user_idx
  on public.user_timeline_events (user_id, created_at desc);

-- ─── Admin audit logs ───
create table if not exists public.admin_audit_logs (
  id uuid primary key default gen_random_uuid(),
  actor_id uuid references public.profiles (id) on delete set null,
  actor_email text not null default '',
  target_user_id uuid references public.profiles (id) on delete set null,
  action text not null,
  details jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create index if not exists admin_audit_logs_created_idx
  on public.admin_audit_logs (created_at desc);

-- ─── Reserved usernames ───
create table if not exists public.reserved_usernames (
  username text primary key,
  reason text not null default '',
  created_by uuid references public.profiles (id) on delete set null,
  created_at timestamptz not null default now()
);

insert into public.reserved_usernames (username, reason) values
  ('admin', 'system'),
  ('administrator', 'system'),
  ('owner', 'system'),
  ('staff', 'system'),
  ('support', 'system'),
  ('system', 'system'),
  ('moderator', 'system'),
  ('mod', 'system'),
  ('verified', 'system'),
  ('official', 'system'),
  ('cried', 'system'),
  ('criedbio', 'system'),
  ('bio', 'system'),
  ('api', 'system'),
  ('root', 'system'),
  ('null', 'system'),
  ('undefined', 'system')
on conflict (username) do nothing;

-- ─── Security events ───
create table if not exists public.security_events (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references public.profiles (id) on delete set null,
  event_type text not null,
  ip_hash text not null default '',
  user_agent text not null default '',
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create index if not exists security_events_created_idx
  on public.security_events (created_at desc);

create index if not exists security_events_type_idx
  on public.security_events (event_type, created_at desc);

-- ─── Access helpers ───
create or replace function public.is_platform_owner()
returns boolean
language sql
stable
security definer
set search_path = public, auth
as $$
  select exists (
    select 1
    from public.profiles p
    join auth.users u on u.id = p.id
    where p.id = auth.uid()
      and (
        p.role = 'owner'
        or public.is_super_admin()
      )
  );
$$;

create or replace function public.is_platform_admin()
returns boolean
language sql
stable
security definer
set search_path = public, auth
as $$
  select public.is_platform_owner()
    or exists (
      select 1 from public.profiles p
      where p.id = auth.uid()
        and (p.role = 'admin' or coalesce(p.is_admin, false) = true)
    );
$$;

revoke all on function public.is_platform_owner() from public;
revoke all on function public.is_platform_admin() from public;
grant execute on function public.is_platform_owner() to authenticated;
grant execute on function public.is_platform_admin() to authenticated;

-- ─── Platform stats RPC ───
create or replace function public.admin_platform_stats()
returns jsonb
language plpgsql
security definer
set search_path = public, auth
as $$
declare
  v_today timestamptz := date_trunc('day', now());
  v_result jsonb;
begin
  if not public.is_platform_admin() then
    raise exception 'Forbidden';
  end if;

  select jsonb_build_object(
    'total_users', (select count(*)::int from public.profiles),
    'new_users_today', (select count(*)::int from public.profiles where created_at >= v_today),
    'active_users_today', (select count(*)::int from public.profiles where last_login_at >= v_today),
    'total_profile_views', (select count(*)::int from public.analytics_events where event_type = 'profile_view'),
    'total_guestbook_posts', (select count(*)::int from public.guestbook_entries),
    'total_profiles_created', (select count(*)::int from public.profiles where username is not null),
    'total_badges_granted', (select count(*)::int from public.profile_badges)
  ) into v_result;

  return v_result;
end;
$$;

revoke all on function public.admin_platform_stats() from public;
grant execute on function public.admin_platform_stats() to authenticated;

-- ─── Enhanced user list ───
create or replace function public.admin_list_users(p_query text default '')
returns table (
  id uuid,
  email text,
  uid bigint,
  username text,
  display_name text,
  role text,
  is_admin boolean,
  is_banned boolean,
  is_disabled boolean,
  premium_tier text,
  premium_expires_at timestamptz,
  badge_count bigint,
  created_at timestamptz,
  last_login_at timestamptz
)
language plpgsql
security definer
set search_path = public, auth
as $$
begin
  if not public.is_platform_admin() then
    raise exception 'Forbidden';
  end if;

  return query
  select
    p.id,
    u.email::text,
    p.uid,
    p.username,
    p.display_name,
    p.role,
    coalesce(p.is_admin, false),
    coalesce(p.is_banned, false),
    coalesce(p.is_disabled, false),
    coalesce(p.premium_tier, 'free'),
    p.premium_expires_at,
    (select count(*) from public.profile_badges pb where pb.profile_id = p.id),
    p.created_at,
    p.last_login_at
  from public.profiles p
  join auth.users u on u.id = p.id
  where p_query = ''
    or p.username ilike '%' || p_query || '%'
    or p.display_name ilike '%' || p_query || '%'
    or u.email ilike '%' || p_query || '%'
    or p.uid::text = p_query
  order by p.created_at desc
  limit 200;
end;
$$;

revoke all on function public.admin_list_users(text) from public;
grant execute on function public.admin_list_users(text) to authenticated;

notify pgrst, 'reload schema';
