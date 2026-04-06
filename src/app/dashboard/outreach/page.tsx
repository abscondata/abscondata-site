import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { OutreachDashboard } from "./outreach-dashboard";
import { SequenceVariants } from "./sequences";

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

  // Pipeline stats — response_status column from migration 010
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const dbAny = supabase as unknown as { from: (table: string) => any };
  const [
    { count: replied },
    { count: interested },
    { count: callBooked },
    { count: notInterested },
  ] = await Promise.all([
    dbAny.from("outreach_leads").select("*", { count: "exact", head: true }).eq("response_status", "replied"),
    dbAny.from("outreach_leads").select("*", { count: "exact", head: true }).eq("response_status", "interested"),
    dbAny.from("outreach_leads").select("*", { count: "exact", head: true }).eq("response_status", "call_booked"),
    dbAny.from("outreach_leads").select("*", { count: "exact", head: true }).eq("response_status", "not_interested"),
  ]);

  // Fetch email sequences
  const { data: sequences } = await dbAny.from("email_sequences")
    .select("*")
    .order("created_at", { ascending: true }) ?? { data: [] };

  return (
    <div className="space-y-8">
      <OutreachDashboard
        stats={{ total: total ?? 0, uploaded: uploaded ?? 0, pending: pending ?? 0 }}
        batches={batches}
        leads={recentLeads ?? []}
        pipelineStats={{
          sent: uploaded ?? 0,
          replied: replied ?? 0,
          interested: interested ?? 0,
          call_booked: callBooked ?? 0,
          not_interested: notInterested ?? 0,
        }}
      />
      <SequenceVariants sequences={sequences ?? []} />
    </div>
  );
}
