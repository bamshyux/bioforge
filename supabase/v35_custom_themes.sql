-- Custom profile themes (scoped CSS editor)
-- Run in Supabase Dashboard → SQL Editor

create table if not exists public.custom_themes (
  id uuid primary key default gen_random_uuid(),
  profile_id uuid not null references public.profiles(id) on delete cascade,
  name text not null,
  css text not null default '',
  sort_order int not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists custom_themes_profile_id_idx
  on public.custom_themes(profile_id, sort_order);

alter table public.profile_settings
  add column if not exists custom_theme_id uuid references public.custom_themes(id) on delete set null;

alter table public.profile_settings drop constraint if exists profile_settings_layout_check;

alter table public.profile_settings add constraint profile_settings_layout_check
  check (layout in (
    'classic', 'modern', 'gaming', 'portfolio', 'minimal',
    'stacked', 'split', 'terminal', 'compact', 'card', 'neon', 'magazine', 'bento',
    'sidebar', 'hero', 'polaroid', 'cinematic', 'showcase', 'retro', 'poster', 'glass',
    'vaporwave', 'brutalist', 'newspaper', 'ticket', 'vinyl', 'discord', 'twitch',
    'idcard', 'blueprint', 'comic', 'cyberpunk', 'luxury', 'receipt', 'zine', 'orbit',
    'wave', 'mosaic', 'aurora', 'hologram', 'spotify', 'spotlight', 'custom'
  ));

-- RLS
alter table public.custom_themes enable row level security;

drop policy if exists "custom_themes_public_read" on public.custom_themes;
create policy "custom_themes_public_read" on public.custom_themes for select using (
  exists (select 1 from public.profiles p where p.id = profile_id and p.username is not null)
);

drop policy if exists "custom_themes_owner_all" on public.custom_themes;
create policy "custom_themes_owner_all" on public.custom_themes for all using (auth.uid() = profile_id);

drop trigger if exists custom_themes_updated_at on public.custom_themes;
create trigger custom_themes_updated_at before update on public.custom_themes
  for each row execute function public.handle_updated_at();

notify pgrst, 'reload schema';
