-- 005_outreach_leads.sql
-- Outreach lead tracking for Apollo/Instantly pipeline

create table if not exists public.outreach_leads (
  id uuid primary key default gen_random_uuid(),
  email text not null unique,
  first_name text,
  last_name text,
  company_name text,
  title text,
  industry text,
  employee_count text,
  location text,
  revenue text,
  phone text,
  linkedin_url text,
  source text default 'apollo',
  apollo_id text unique,
  batch_id text,
  status text default 'new',
  campaign_name text,
  uploaded_to_instantly boolean default false,
  uploaded_at timestamptz,
  rejected_reason text,
  created_at timestamptz default now()
);

alter table public.outreach_leads enable row level security;

create policy "Owners full access outreach_leads" on public.outreach_leads for all
  using (exists (select 1 from public.profiles where id = auth.uid() and role = 'owner'));

create index idx_outreach_leads_email on public.outreach_leads(email);
create index idx_outreach_leads_status on public.outreach_leads(status);
create index idx_outreach_leads_batch on public.outreach_leads(batch_id);
