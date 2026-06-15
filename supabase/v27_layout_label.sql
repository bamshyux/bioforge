-- cried.bio v27: Custom layout label text (ticket, id card, vinyl, etc.)

alter table public.profile_settings
  add column if not exists layout_label text not null default '';

comment on column public.profile_settings.layout_label is 'Custom label text for layouts that support it (ticket, idcard, vinyl, etc.)';

notify pgrst, 'reload schema';
