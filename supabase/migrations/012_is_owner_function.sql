-- Define is_owner() helper function used by RLS policies
-- in migrations 006, 008, 010, 011 (and any future policies).
-- Returns true if the current authenticated user has role='owner' in profiles.
--
-- SECURITY DEFINER lets the function bypass RLS on profiles when looking up
-- the role (the user's own profile is readable to them anyway, but this
-- ensures the function works even if profile-read policies change).

CREATE OR REPLACE FUNCTION public.is_owner()
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = auth.uid() AND role = 'owner'
  );
$$;
