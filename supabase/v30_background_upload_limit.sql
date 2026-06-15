-- cried.bio v30: Raise backgrounds bucket upload limit to 65 MB

update storage.buckets
set file_size_limit = 68157440
where id = 'backgrounds';

notify pgrst, 'reload schema';
