-- Backfill the users table with existing auth users
INSERT INTO public.users (id, email)
SELECT id, email 
FROM auth.users
WHERE id NOT IN (SELECT id FROM public.users)
ON CONFLICT (id) DO NOTHING;

-- Verify the users table has been populated
SELECT * FROM public.users LIMIT 10;