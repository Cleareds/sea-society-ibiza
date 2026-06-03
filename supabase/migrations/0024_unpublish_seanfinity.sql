-- Hide SEANFINITY T4 from the public site until Anton is ready to
-- launch it. The row stays in place with its 2026 pricing so the data
-- is here when needed; only is_published flips. Re-enable with
--   update public.boats set is_published = true where slug = 'seanfinity-t4';
update public.boats
   set is_published = false
 where slug = 'seanfinity-t4';
