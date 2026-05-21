-- Public "boats" storage bucket for hero / gallery images uploaded via /admin.
-- Public read (so transform URLs work without signed access), authenticated
-- writes. Server-side uploads use the secret key which bypasses RLS anyway —
-- the policies are defence in depth.

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'boats',
  'boats',
  true,
  12582912, -- 12 MB
  array['image/jpeg','image/png','image/webp','image/avif']
)
on conflict (id) do update
  set public = excluded.public,
      file_size_limit = excluded.file_size_limit,
      allowed_mime_types = excluded.allowed_mime_types;

-- Read is permitted by virtue of `public=true`; no SELECT policy needed.

drop policy if exists "authenticated write boats" on storage.objects;
create policy "authenticated write boats"
  on storage.objects for insert
  to authenticated
  with check (bucket_id = 'boats');

drop policy if exists "authenticated update boats" on storage.objects;
create policy "authenticated update boats"
  on storage.objects for update
  to authenticated
  using (bucket_id = 'boats');

drop policy if exists "authenticated delete boats" on storage.objects;
create policy "authenticated delete boats"
  on storage.objects for delete
  to authenticated
  using (bucket_id = 'boats');
