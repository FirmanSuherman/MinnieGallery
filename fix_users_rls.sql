-- Check if the users table exists and has data
SELECT COUNT(*) FROM public.users;

-- Check if auth users exist
SELECT COUNT(*) FROM auth.users;

-- If users table is missing data, run the backfill
INSERT INTO public.users (id, email)
SELECT id, email 
FROM auth.users
WHERE id NOT IN (SELECT id FROM public.users)
ON CONFLICT (id) DO NOTHING;

-- Check again if the users table has been populated
SELECT * FROM public.users LIMIT 10;

-- If the 406 error persists, let's make the RLS policy more permissive for testing
DROP POLICY IF EXISTS "Allow users to read user data" ON users;

-- Create a more permissive policy for testing
CREATE POLICY "Allow all users to read user data" ON users
FOR SELECT TO authenticated
USING (true);

-- Verify the policy is created
SELECT policyname, permissive, roles, cmd FROM pg_policies WHERE tablename = 'users';