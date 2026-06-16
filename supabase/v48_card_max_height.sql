-- Profile card vertical size (edit profile mode)
alter table public.profile_settings
  add column if not exists card_max_height integer not null default 0
    check (card_max_height >= 0 and card_max_height <= 2000);

comment on column public.profile_settings.card_max_height is 'Max profile card height in px; 0 = auto (fit content)';
