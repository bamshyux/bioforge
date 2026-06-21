-- Card border effects on profile_settings
alter table public.profile_settings
  add column if not exists card_border_effect text not null default 'none',
  add column if not exists card_border_thickness integer not null default 2,
  add column if not exists card_border_speed integer not null default 100,
  add column if not exists card_border_glow_intensity integer not null default 60,
  add column if not exists card_border_color text not null default '',
  add column if not exists card_border_secondary_color text not null default '',
  add column if not exists card_border_apply_all boolean not null default true,
  add column if not exists card_border_targets jsonb not null default '["main","discord","roblox","spotify","links","guestbook"]'::jsonb;

comment on column public.profile_settings.card_border_effect is 'Animated border preset for profile cards (none, snake, neon-glow, etc.)';
comment on column public.profile_settings.card_border_thickness is 'Border effect thickness in px (1-12)';
comment on column public.profile_settings.card_border_speed is 'Effect speed percentage (25-300, 100 = normal)';
comment on column public.profile_settings.card_border_glow_intensity is 'Glow intensity 0-100';
comment on column public.profile_settings.card_border_apply_all is 'When true, effect applies to all enabled card types';
comment on column public.profile_settings.card_border_targets is 'Card types to apply border effect when apply_all is false';
