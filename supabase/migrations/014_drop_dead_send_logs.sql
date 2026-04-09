-- Drop the dead send_logs table (plural).
--
-- migration 002_v1_execution_spine.sql created public.send_logs (plural)
-- migration 009_send_log_onboarding.sql created public.send_log (singular)
--
-- Application code only writes to / reads from send_log (singular,
-- created in 009). The plural send_logs table has never been used
-- by the dashboard.
--
-- Verified by grep: send_logs is referenced only in
-- src/lib/database.types.ts (auto-generated, not actual code).
--
-- Drop with CASCADE to remove any dependent policies/grants.

DROP TABLE IF EXISTS public.send_logs CASCADE;
