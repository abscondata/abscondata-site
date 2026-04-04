-- 004_abscondata_rebuild.sql
-- New tables for Abscondata rebuild: services, platforms, onboarding, templates, imports

-- client_services: which services are enabled per client
create table if not exists public.client_services (
  id uuid primary key default gen_random_uuid(),
  client_id bigint not null references public.clients(id) on delete cascade,
  service_key text not null,
  enabled boolean not null default true,
  config_json jsonb default '{}',
  created_at timestamptz not null default now(),
  unique(client_id, service_key)
);

-- client_platforms: what tools/platforms each client uses
create table if not exists public.client_platforms (
  id uuid primary key default gen_random_uuid(),
  client_id bigint not null references public.clients(id) on delete cascade,
  platform_key text not null,
  connection_method text default 'pending',
  connection_status text default 'not_connected',
  credentials_ref text,
  notes text,
  last_sync_at timestamptz,
  created_at timestamptz not null default now(),
  unique(client_id, platform_key)
);

-- onboarding_submissions: raw onboarding form data
create table if not exists public.onboarding_submissions (
  id uuid primary key default gen_random_uuid(),
  client_id bigint references public.clients(id),
  payload_json jsonb not null,
  status text not null default 'pending',
  created_at timestamptz not null default now()
);

-- task_templates: reusable task definitions per service
create table if not exists public.task_templates (
  id uuid primary key default gen_random_uuid(),
  service_key text not null,
  title text not null,
  description text,
  default_status text default 'NEW',
  requires_review boolean default true,
  sort_order integer default 0,
  created_at timestamptz not null default now()
);

-- imports: CSV/manual data import tracking
create table if not exists public.imports (
  id uuid primary key default gen_random_uuid(),
  client_id bigint not null references public.clients(id) on delete cascade,
  import_type text not null,
  source_name text,
  status text not null default 'pending',
  storage_key text,
  summary_json jsonb,
  row_count integer default 0,
  created_at timestamptz not null default now()
);

-- Add service_key to tasks if not exists (links tasks to service types)
alter table public.tasks add column if not exists service_key text;

-- Enable RLS on all new tables
alter table public.client_services enable row level security;
alter table public.client_platforms enable row level security;
alter table public.onboarding_submissions enable row level security;
alter table public.task_templates enable row level security;
alter table public.imports enable row level security;

-- RLS: owner can do everything on all new tables
create policy "Owners full access client_services" on public.client_services for all
  using (exists (select 1 from public.profiles where id = auth.uid() and role = 'owner'));

create policy "Owners full access client_platforms" on public.client_platforms for all
  using (exists (select 1 from public.profiles where id = auth.uid() and role = 'owner'));

create policy "Owners full access onboarding_submissions" on public.onboarding_submissions for all
  using (exists (select 1 from public.profiles where id = auth.uid() and role = 'owner'));

create policy "Owners full access task_templates" on public.task_templates for all
  using (exists (select 1 from public.profiles where id = auth.uid() and role = 'owner'));

create policy "Owners full access imports" on public.imports for all
  using (exists (select 1 from public.profiles where id = auth.uid() and role = 'owner'));

-- Allow anonymous inserts to onboarding_submissions (public form)
create policy "Public can submit onboarding" on public.onboarding_submissions
  for insert to anon with check (true);

-- Allow authenticated users to read task_templates (needed for generating tasks)
create policy "Authenticated read task_templates" on public.task_templates
  for select to authenticated using (true);

-- Seed task templates for payment follow-up service
insert into public.task_templates (service_key, title, description, requires_review, sort_order) values
  ('payment_followup', 'Review overdue invoices', 'Pull list of invoices 30+ days overdue from client system', true, 1),
  ('payment_followup', 'Draft payment reminder', 'AI drafts reminder email for overdue account', true, 2),
  ('payment_followup', 'Send payment reminder', 'Send approved reminder to client customer', true, 3),
  ('payment_followup', 'Log collection outcome', 'Record result: paid, promised, escalated, or no response', false, 4),
  ('invoice_ops', 'Generate invoice', 'Create invoice from completed job data', true, 1),
  ('invoice_ops', 'Send invoice', 'Send approved invoice to customer', true, 2),
  ('invoice_ops', 'Track invoice status', 'Update status: sent, viewed, paid, overdue', false, 3),
  ('review_requests', 'Queue review request', 'Identify completed jobs eligible for review request', true, 1),
  ('review_requests', 'Draft review request', 'AI drafts review request message', true, 2),
  ('review_requests', 'Send review request', 'Send approved review request to customer', true, 3),
  ('weekly_summary', 'Compile weekly data', 'Pull task completion, invoice, and collection data for the week', false, 1),
  ('weekly_summary', 'Draft weekly summary', 'AI drafts weekly business summary report', true, 2),
  ('weekly_summary', 'Deliver weekly summary', 'Send approved summary to client', true, 3);
