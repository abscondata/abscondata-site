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

CREATE POLICY "Owners can read snapshots" ON daily_snapshots
  FOR SELECT USING (is_owner());

CREATE POLICY "Service role inserts snapshots" ON daily_snapshots
  FOR INSERT WITH CHECK (true);
