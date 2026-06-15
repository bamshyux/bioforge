-- cried.bio v28: Profile card position, size, and border visibility

alter table public.profile_settings
  add column if not exists hide_card_border boolean not null default false,
  add column if not exists card_offset_x integer not null default 0
    check (card_offset_x between -500 and 500),
  add column if not exists card_offset_y integer not null default 0
    check (card_offset_y between -500 and 500),
  add column if not exists card_width integer not null default 100
    check (card_width between 50 and 150);

comment on column public.profile_settings.hide_card_border is 'Hide the profile card border (useful at 0% opacity)';
comment on column public.profile_settings.card_offset_x is 'Horizontal offset of profile card from center (px)';
comment on column public.profile_settings.card_offset_y is 'Vertical offset of profile card from center (px)';
comment on column public.profile_settings.card_width is 'Profile card width as % of max container width';

notify pgrst, 'reload schema';
