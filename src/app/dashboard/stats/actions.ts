"use server";

import { createClient } from "@/lib/supabase/server";

// daily_snapshots table is not yet in generated types — will be after migration runs
// eslint-disable-next-line @typescript-eslint/no-explicit-any
type AnyFrom = any;

export async function captureDailySnapshot(): Promise<{ success: boolean; message: string }> {
  try {
    const supabase = await createClient();
    const db = supabase as unknown as { from: (table: string) => AnyFrom };
    const today = new Date().toISOString().slice(0, 10);

    // Check if snapshot already exists for today
    const { data: existing } = await db
      .from("daily_snapshots")
      .select("id")
      .eq("snapshot_date", today)
      .single();

    if (existing) return { success: true, message: "Snapshot already exists for today" };

    // Gather stats
    const [
      { count: activeClients },
      { count: openTasks },
      { count: leadsTotal },
      { count: leadsUploaded },
    ] = await Promise.all([
      supabase.from("clients").select("*", { count: "exact", head: true }).eq("status", "active"),
      supabase.from("tasks").select("*", { count: "exact", head: true }).neq("status", "CLOSED"),
      supabase.from("outreach_leads").select("*", { count: "exact", head: true }),
      supabase.from("outreach_leads").select("*", { count: "exact", head: true }).eq("uploaded_to_instantly", true),
    ]);

    // Tasks completed today
    const todayStart = new Date(today + "T00:00:00Z").toISOString();
    const { count: completedToday } = await supabase
      .from("tasks")
      .select("*", { count: "exact", head: true })
      .in("status", ["SENT", "CLOSED"])
      .gte("sent_at", todayStart);

    // Tasks completed this week
    const weekAgo = new Date(Date.now() - 7 * 24 * 3600000).toISOString();
    const { count: completedWeek } = await supabase
      .from("tasks")
      .select("*", { count: "exact", head: true })
      .in("status", ["SENT", "CLOSED"])
      .gte("sent_at", weekAgo);

    const { error } = await db.from("daily_snapshots").insert({
      snapshot_date: today,
      active_clients: activeClients ?? 0,
      open_tasks: openTasks ?? 0,
      tasks_completed_today: completedToday ?? 0,
      tasks_completed_week: completedWeek ?? 0,
      leads_total: leadsTotal ?? 0,
      leads_uploaded: leadsUploaded ?? 0,
    });

    if (error) return { success: false, message: error.message };
    return { success: true, message: "Daily snapshot captured" };
  } catch (err) {
    return { success: false, message: err instanceof Error ? err.message : "Snapshot failed" };
  }
}
