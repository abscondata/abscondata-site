-- ============================================================
-- Consolidated migration: all schema changes from tonight
-- Safe to run even if individual migrations were already applied
-- (uses IF NOT EXISTS and DROP POLICY IF EXISTS throughout)
-- ============================================================

-- Daily snapshots
CREATE TABLE IF NOT EXISTS daily_snapshots (
  id bigint generated always as identity primary key,
  snapshot_date date not null unique,
  active_clients int default 0,
  open_tasks int default 0,
  tasks_completed_today int default 0,
  tasks_completed_week int default 0,
  leads_total int default 0,
  leads_uploaded int default 0,
  created_at timestamptz default now()
);
ALTER TABLE daily_snapshots ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Owners can read snapshots" ON daily_snapshots;
CREATE POLICY "Owners can read snapshots" ON daily_snapshots FOR SELECT USING (is_owner());
DROP POLICY IF EXISTS "Service role inserts snapshots" ON daily_snapshots;
CREATE POLICY "Service role inserts snapshots" ON daily_snapshots FOR INSERT WITH CHECK (true);

-- Templates enabled
ALTER TABLE task_templates ADD COLUMN IF NOT EXISTS enabled boolean DEFAULT true;

-- Client invoices
CREATE TABLE IF NOT EXISTS client_invoices (
  id bigint generated always as identity primary key,
  client_id bigint references clients(id) on delete cascade,
  invoice_date date not null,
  amount decimal(10,2) not null,
  status text default 'sent' check (status in ('sent', 'paid', 'overdue')),
  notes text,
  created_at timestamptz default now()
);
ALTER TABLE client_invoices ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Owners manage invoices" ON client_invoices;
CREATE POLICY "Owners manage invoices" ON client_invoices FOR ALL USING (is_owner());

-- Client notes and platform URLs
ALTER TABLE clients ADD COLUMN IF NOT EXISTS notes text;
ALTER TABLE client_platforms ADD COLUMN IF NOT EXISTS platform_url text;

-- Send log
CREATE TABLE IF NOT EXISTS send_log (
  id bigint generated always as identity primary key,
  task_id bigint references tasks(id) on delete cascade,
  client_id bigint references clients(id) on delete cascade,
  service_key text not null,
  recipient_name text,
  recipient_email text,
  sent_content text,
  sent_at timestamptz default now(),
  sent_by uuid references profiles(id)
);
ALTER TABLE send_log ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Owners and VAs read send_log" ON send_log;
CREATE POLICY "Owners and VAs read send_log" ON send_log FOR SELECT USING (true);
DROP POLICY IF EXISTS "Authenticated insert send_log" ON send_log;
CREATE POLICY "Authenticated insert send_log" ON send_log FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);

-- Onboarding SOP reviewed
ALTER TABLE clients ADD COLUMN IF NOT EXISTS onboarding_sop_reviewed boolean DEFAULT false;

-- Outreach intelligence
ALTER TABLE outreach_leads ADD COLUMN IF NOT EXISTS segment text;
ALTER TABLE outreach_leads ADD COLUMN IF NOT EXISTS personalization_line text;
ALTER TABLE outreach_leads ADD COLUMN IF NOT EXISTS response_status text DEFAULT 'no_response';
ALTER TABLE outreach_leads ADD COLUMN IF NOT EXISTS response_notes text;
ALTER TABLE outreach_leads ADD COLUMN IF NOT EXISTS response_date timestamptz;

-- Email sequences
CREATE TABLE IF NOT EXISTS email_sequences (
  id bigint generated always as identity primary key,
  name text not null,
  step1_subject text,
  step1_body text,
  step2_subject text,
  step2_body text,
  step3_subject text,
  step3_body text,
  active boolean default false,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);
ALTER TABLE email_sequences ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Owners manage sequences" ON email_sequences;
CREATE POLICY "Owners manage sequences" ON email_sequences FOR ALL USING (is_owner());

-- Seed Variant A (only if table is empty)
INSERT INTO email_sequences (name, step1_subject, step1_body, step2_subject, step2_body, step3_subject, step3_body, active)
SELECT
  'Variant A — Current',
  '{{companyName}} back office operations',
  'Hi {{firstName}},

{{personalization}}

I run Abscondata, a managed back-office service for small service businesses in Florida. We handle invoicing, payment follow-ups, review requests, and weekly reporting so the owner can stop drowning in admin.

Flat monthly rate. Month-to-month. Florida-based.

Worth a quick call to see if it fits?

Robin
Abscondata',
  're: {{companyName}} back office operations',
  'Hi {{firstName}},

Following up on my note from earlier this week.

What an engagement looks like: we use your existing tools (QuickBooks, your CRM, Google Business Profile, whatever you have). A trained operator handles invoicing and follow-ups every day, you get a weekly summary of what was done, and you stay in control of everything that goes out.

No software to buy. No long contracts. 30-day cancel anytime.

Open to a 15-minute call this week?

Robin
Abscondata',
  '{{companyName}}',
  'Hi {{firstName}},

Last note from me.

If back-office work is something you want off your plate, here is the link to share what you need: https://abscondata.com/onboarding

If not, no problem. I will leave you alone.

Robin
Abscondata',
  true
WHERE NOT EXISTS (SELECT 1 FROM email_sequences LIMIT 1);
