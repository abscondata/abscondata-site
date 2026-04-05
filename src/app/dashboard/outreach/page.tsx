import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { OutreachDashboard } from "./outreach-dashboard";

export default async function OutreachPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: profile } = await supabase.from("profiles").select("*").eq("id", user.id).single();
  if (profile?.role !== "owner") redirect("/dashboard");

  // Stats
  const [
    { count: total },
    { count: uploaded },
    { count: pending },
  ] = await Promise.all([
    supabase.from("outreach_leads").select("*", { count: "exact", head: true }),
    supabase.from("outreach_leads").select("*", { count: "exact", head: true }).eq("uploaded_to_instantly", true),
    supabase.from("outreach_leads").select("*", { count: "exact", head: true }).eq("uploaded_to_instantly", false),
  ]);

  // Batches: get distinct batch_ids with counts
  const { data: allLeads } = await supabase
    .from("outreach_leads")
    .select("batch_id, uploaded_to_instantly, created_at")
    .not("batch_id", "is", null)
    .order("created_at", { ascending: false });

  const batchMap = new Map<string, { count: number; uploaded: number; date: string }>();
  for (const lead of allLeads ?? []) {
    const bid = lead.batch_id!;
    const existing = batchMap.get(bid);
    if (existing) {
      existing.count++;
      if (lead.uploaded_to_instantly) existing.uploaded++;
    } else {
      batchMap.set(bid, {
        count: 1,
        uploaded: lead.uploaded_to_instantly ? 1 : 0,
        date: lead.created_at,
      });
    }
  }
  const batches = Array.from(batchMap.entries()).map(([id, info]) => ({
    id,
    count: info.count,
    uploaded: info.uploaded,
    date: info.date,
  }));

  // Recent leads
  const { data: recentLeads } = await supabase
    .from("outreach_leads")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(50);

  return (
    <OutreachDashboard
      stats={{ total: total ?? 0, uploaded: uploaded ?? 0, pending: pending ?? 0 }}
      batches={batches}
      leads={recentLeads ?? []}
    />
  );
}
