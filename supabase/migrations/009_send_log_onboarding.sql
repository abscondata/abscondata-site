-- Send log for proof of delivery
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

CREATE POLICY "Owners and VAs read send_log" ON send_log
  FOR SELECT USING (true);

CREATE POLICY "Authenticated insert send_log" ON send_log
  FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);

-- Onboarding SOP reviewed flag
ALTER TABLE clients ADD COLUMN IF NOT EXISTS onboarding_sop_reviewed boolean DEFAULT false;
