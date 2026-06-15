-- cried.bio v25: Account settings, MFA recovery codes, sessions, login history

create table if not exists public.account_preferences (
  profile_id uuid primary key references public.profiles (id) on delete cascade,
  phone_number text not null default '',
  email_notifications boolean not null default true,
  marketing_emails boolean not null default false,
  profile_visibility text not null default 'public'
    check (profile_visibility in ('public', 'unlisted', 'private')),
  show_in_search boolean not null default true,
  hide_view_counts boolean not null default false,
  allow_direct_contact boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

drop trigger if exists account_preferences_updated_at on public.account_preferences;
create trigger account_preferences_updated_at
before update on public.account_preferences
for each row execute function public.handle_updated_at();

alter table public.account_preferences enable row level security;

drop policy if exists "Users manage own account preferences" on public.account_preferences;
create policy "Users manage own account preferences"
on public.account_preferences
for all
using (auth.uid() = profile_id)
with check (auth.uid() = profile_id);

drop policy if exists "Public read visibility for profiles" on public.account_preferences;
create policy "Public read visibility for profiles"
on public.account_preferences
for select
using (true);

create table if not exists public.mfa_recovery_codes (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  code_hash text not null,
  used_at timestamptz,
  created_at timestamptz not null default now()
);

create index if not exists mfa_recovery_codes_user_id_idx
  on public.mfa_recovery_codes (user_id);

alter table public.mfa_recovery_codes enable row level security;

drop policy if exists "Users read own recovery codes" on public.mfa_recovery_codes;
create policy "Users read own recovery codes"
on public.mfa_recovery_codes
for select
using (auth.uid() = user_id);

create table if not exists public.login_history (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  ip_address text,
  user_agent text,
  device_label text,
  success boolean not null default true,
  created_at timestamptz not null default now()
);

create index if not exists login_history_user_created_idx
  on public.login_history (user_id, created_at desc);

alter table public.login_history enable row level security;

drop policy if exists "Users read own login history" on public.login_history;
create policy "Users read own login history"
on public.login_history
for select
using (auth.uid() = user_id);

create table if not exists public.user_sessions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  session_token_hash text not null,
  ip_address text,
  user_agent text,
  device_label text,
  last_active_at timestamptz not null default now(),
  created_at timestamptz not null default now(),
  revoked_at timestamptz
);

create unique index if not exists user_sessions_user_token_idx
  on public.user_sessions (user_id, session_token_hash);

create index if not exists user_sessions_user_active_idx
  on public.user_sessions (user_id, last_active_at desc);

alter table public.user_sessions enable row level security;

drop policy if exists "Users read own sessions" on public.user_sessions;
create policy "Users read own sessions"
on public.user_sessions
for select
using (auth.uid() = user_id);

drop policy if exists "Users update own sessions" on public.user_sessions;
create policy "Users update own sessions"
on public.user_sessions
for update
using (auth.uid() = user_id)
with check (auth.uid() = user_id);

drop policy if exists "Users insert own sessions" on public.user_sessions;
create policy "Users insert own sessions"
on public.user_sessions
for insert
with check (auth.uid() = user_id);

drop policy if exists "Users insert own login history" on public.login_history;
create policy "Users insert own login history"
on public.login_history
for insert
with check (auth.uid() = user_id);

drop policy if exists "Users insert own recovery codes" on public.mfa_recovery_codes;
create policy "Users insert own recovery codes"
on public.mfa_recovery_codes
for insert
with check (auth.uid() = user_id);

drop policy if exists "Users delete own recovery codes" on public.mfa_recovery_codes;
create policy "Users delete own recovery codes"
on public.mfa_recovery_codes
for delete
using (auth.uid() = user_id);

drop policy if exists "Users update own recovery codes" on public.mfa_recovery_codes;
create policy "Users update own recovery codes"
on public.mfa_recovery_codes
for update
using (auth.uid() = user_id)
with check (auth.uid() = user_id);

-- Self-service account deletion
create or replace function public.delete_own_account(p_confirm_username text)
returns void
language plpgsql
security definer
set search_path = public, auth
as $$
declare
  v_username text;
begin
  if auth.uid() is null then
    raise exception 'Not authenticated';
  end if;

  select username into v_username
  from public.profiles
  where id = auth.uid();

  if v_username is null then
    raise exception 'Profile not found';
  end if;

  if lower(trim(p_confirm_username)) <> v_username then
    raise exception 'Confirmation username does not match';
  end if;

  delete from auth.users where id = auth.uid();
end;
$$;

revoke all on function public.delete_own_account(text) from public;
grant execute on function public.delete_own_account(text) to authenticated;

-- Reset public profile customization (keeps auth account + username)
create or replace function public.reset_own_profile()
returns void
language plpgsql
security definer
set search_path = public
as $$
declare
  v_uid uuid := auth.uid();
begin
  if v_uid is null then
    raise exception 'Not authenticated';
  end if;

  update public.profiles
  set
    display_name = '',
    bio = '',
    avatar_url = null,
    banner_url = null,
    updated_at = now()
  where id = v_uid;

  delete from public.links where profile_id = v_uid;
  delete from public.profile_embeds where profile_id = v_uid;
  delete from public.featured_blocks where profile_id = v_uid;
  delete from public.guestbook_entries where profile_id = v_uid;

  delete from public.profile_settings where profile_id = v_uid;
  insert into public.profile_settings (profile_id) values (v_uid);
end;
$$;

revoke all on function public.reset_own_profile() from public;
grant execute on function public.reset_own_profile() to authenticated;

notify pgrst, 'reload schema';
