-- RPC function used by n8n to check if a source_record_id already exists
-- in task_source_data before creating a duplicate task.

create or replace function public.check_duplicate_source_record(p_source_record_id text)
returns boolean
language sql
security definer
stable
as $$
  select exists (
    select 1 from public.tasks
    where source_record_id = p_source_record_id
  );
$$;
