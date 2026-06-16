-- cried.bio v60: Rate limit event log (service-role only)

create table if not exists public.rate_limit_events (
  id bigserial primary key,
  bucket_key text not null,
  created_at timestamptz default now() not null
);

create index if not exists rate_limit_events_bucket_created_idx
  on public.rate_limit_events (bucket_key, created_at desc);

alter table public.rate_limit_events enable row level security;

notify pgrst, 'reload schema';
