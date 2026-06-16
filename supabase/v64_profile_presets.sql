-- Profile Presets: save and switch full profile appearance configurations
create table if not exists public.profile_presets (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  name text not null,
  thumbnail_url text,
  preset_data jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists profile_presets_user_id_idx
  on public.profile_presets(user_id, updated_at desc);

alter table public.profile_settings
  add column if not exists active_preset_id uuid references public.profile_presets(id) on delete set null;

alter table public.profile_presets enable row level security;

drop policy if exists "profile_presets_owner_all" on public.profile_presets;
create policy "profile_presets_owner_all" on public.profile_presets
  for all using (auth.uid() = user_id);

drop trigger if exists profile_presets_updated_at on public.profile_presets;
create trigger profile_presets_updated_at before update on public.profile_presets
  for each row execute function public.handle_updated_at();

notify pgrst, 'reload schema';
