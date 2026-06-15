-- cried.bio v42: Customizable link icon size on public profiles

alter table public.profile_settings
  add column if not exists links_icon_size int not null default 24;

alter table public.profile_settings
  drop constraint if exists profile_settings_links_icon_size_check;

alter table public.profile_settings
  add constraint profile_settings_links_icon_size_check
  check (links_icon_size >= 14 and links_icon_size <= 40);

notify pgrst, 'reload schema';
