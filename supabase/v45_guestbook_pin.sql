-- Pin a single guestbook message to the top of a profile's guestbook section.

alter table public.guestbook_entries
  add column if not exists is_pinned boolean not null default false,
  add column if not exists pinned_at timestamptz;

create index if not exists guestbook_entries_pinned_idx
  on public.guestbook_entries (profile_id, is_pinned desc, created_at desc);
