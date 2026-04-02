-- ============================================================
-- 002_v1_execution_spine.sql
-- Abscondata v1 execution spine — new tables, column additions,
-- task status enum, and RLS policies.
-- ============================================================

-- 1. Task status enum
create type public.task_status as enum (
  'NEW',
  'WAITING_ON_MISSING_DATA',
  'READY_FOR_REVIEW',
  'EXCEPTION',
  'APPROVED',
  'SENT',
  'FAILED',
  'CLOSED'
);

-- Convert existing tasks.status from text to the new enum.
-- Any current values that don't match the enum are mapped to 'NEW'.
alter table public.tasks
  alter column status drop default,
  alter column status type public.task_status
    using (
      case upper(status)
        when 'NEW' then 'NEW'::public.task_status
        when 'WAITING_ON_MISSING_DATA' then 'WAITING_ON_MISSING_DATA'::public.task_status
        when 'READY_FOR_REVIEW' then 'READY_FOR_REVIEW'::public.task_status
        when 'EXCEPTION' then 'EXCEPTION'::public.task_status
        when 'APPROVED' then 'APPROVED'::public.task_status
        when 'SENT' then 'SENT'::public.task_status
        when 'FAILED' then 'FAILED'::public.task_status
        when 'CLOSED' then 'CLOSED'::public.task_status
        when 'COMPLETE' then 'CLOSED'::public.task_status
        else 'NEW'::public.task_status
      end
    ),
  alter column status set default 'NEW'::public.task_status;

-- 2. Add columns to tasks
alter table public.tasks
  add column if not exists workflow_type text,
  add column if not exists source_system text,
  add column if not exists source_record_id text,
  add column if not exists edited_draft text,
  add column if not exists final_message text,
  add column if not exists recipient_email text,
  add column if not exists recipient_name text,
  add column if not exists subject_line text,
  add column if not exists approved_at timestamptz,
  add column if not exists sent_at timestamptz,
  add column if not exists failed_at timestamptz,
  add column if not exists rejection_reason text,
  add column if not exists exception_reason_code text,
  add column if not exists exception_description text,
  add column if not exists updated_at timestamptz default now();

-- 3. Add columns to clients
alter table public.clients
  add column if not exists timezone text,
  add column if not exists service_area text,
  add column if not exists business_hours text,
  add column if not exists escalation_email text;

-- 4. Add columns to exceptions
alter table public.exceptions
  add column if not exists resolved_by text,
  add column if not exists resolved_at timestamptz;

-- 5. client_configs table
create table public.client_configs (
  id uuid primary key default gen_random_uuid(),
  client_id bigint references public.clients(id),
  workflow_type text not null,
  is_enabled boolean default true,
  send_window_start time,
  send_window_end time,
  send_days text[],
  tone_profile text,
  exclusion_rules_json jsonb,
  trigger_rules_json jsonb,
  cooldown_rules_json jsonb,
  escalation_rules_json jsonb,
  created_at timestamptz default now()
);

alter table public.client_configs enable row level security;

create policy "Owners can do everything on client_configs"
  on public.client_configs for all
  using (
    exists (
      select 1 from public.profiles
      where id = auth.uid() and role = 'owner'
    )
  );

create policy "VAs can read configs for their assigned clients"
  on public.client_configs for select
  using (
    client_id in (
      select distinct client_id from public.tasks
      where assigned_va = (select email from public.profiles where id = auth.uid())
    )
  );

-- 6. task_source_data table
create table public.task_source_data (
  id uuid primary key default gen_random_uuid(),
  task_id bigint references public.tasks(id),
  payload_json jsonb,
  normalized_fields_json jsonb,
  created_at timestamptz default now()
);

alter table public.task_source_data enable row level security;

create policy "Owners can do everything on task_source_data"
  on public.task_source_data for all
  using (
    exists (
      select 1 from public.profiles
      where id = auth.uid() and role = 'owner'
    )
  );

create policy "VAs can read source data for their assigned tasks"
  on public.task_source_data for select
  using (
    task_id in (
      select id from public.tasks
      where assigned_va = (select email from public.profiles where id = auth.uid())
    )
  );

-- 7. task_events table
create table public.task_events (
  id uuid primary key default gen_random_uuid(),
  task_id bigint references public.tasks(id),
  event_type text not null,
  actor_type text,
  actor_id text,
  notes text,
  created_at timestamptz default now()
);

alter table public.task_events enable row level security;

create policy "Owners can do everything on task_events"
  on public.task_events for all
  using (
    exists (
      select 1 from public.profiles
      where id = auth.uid() and role = 'owner'
    )
  );

create policy "VAs can read events for their assigned tasks"
  on public.task_events for select
  using (
    task_id in (
      select id from public.tasks
      where assigned_va = (select email from public.profiles where id = auth.uid())
    )
  );

create policy "VAs can insert events for their assigned tasks"
  on public.task_events for insert
  with check (
    task_id in (
      select id from public.tasks
      where assigned_va = (select email from public.profiles where id = auth.uid())
    )
  );

-- 8. send_logs table
create table public.send_logs (
  id uuid primary key default gen_random_uuid(),
  task_id bigint references public.tasks(id),
  channel text,
  sender text,
  recipient text,
  subject_line text,
  body_snapshot text,
  delivery_status text,
  external_message_id text,
  sent_at timestamptz,
  error_text text,
  created_at timestamptz default now()
);

alter table public.send_logs enable row level security;

create policy "Owners can do everything on send_logs"
  on public.send_logs for all
  using (
    exists (
      select 1 from public.profiles
      where id = auth.uid() and role = 'owner'
    )
  );

create policy "VAs can read send_logs for their assigned tasks"
  on public.send_logs for select
  using (
    task_id in (
      select id from public.tasks
      where assigned_va = (select email from public.profiles where id = auth.uid())
    )
  );

-- 9. Auto-update updated_at on tasks
create or replace function public.set_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger tasks_set_updated_at
  before update on public.tasks
  for each row execute procedure public.set_updated_at();
