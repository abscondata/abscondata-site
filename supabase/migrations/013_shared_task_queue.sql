-- Drop VA-restrictive task RLS policies in favor of a shared queue.
--
-- Background: migration 001 added "VAs can read their assigned tasks"
-- and "VAs can update their assigned tasks" policies that filter by
-- tasks.assigned_va = profile.email. The application code never sets
-- assigned_va on inserts, so under those policies a VA login showed
-- zero tasks.
--
-- Decision (audit Option A): VAs share a single queue and pick tasks.
-- This matches Robin's actual operating model and removes the bug
-- with minimum surface area. assigned_va column is left in place for
-- future per-task assignment if needed.

DROP POLICY IF EXISTS "VAs can read their assigned tasks" ON public.tasks;
DROP POLICY IF EXISTS "VAs can update their assigned tasks" ON public.tasks;

-- Replace with policies that let any authenticated user (owner or VA)
-- read and update tasks. The owner policy from migration 001 still
-- exists; these new policies broaden VA access to match.
CREATE POLICY "Authenticated users can read tasks"
  ON public.tasks FOR SELECT
  USING (auth.uid() IS NOT NULL);

CREATE POLICY "Authenticated users can update tasks"
  ON public.tasks FOR UPDATE
  USING (auth.uid() IS NOT NULL);
