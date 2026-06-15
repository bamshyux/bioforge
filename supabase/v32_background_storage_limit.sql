-- cried.bio v32: Ensure backgrounds bucket stays at 50 MB (Supabase Free limit)

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'backgrounds',
  'backgrounds',
  true,
  52428800,
  array['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'video/mp4']
)
on conflict (id) do update set
  public = true,
  file_size_limit = 52428800,
  allowed_mime_types = array['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'video/mp4'];

notify pgrst, 'reload schema';
