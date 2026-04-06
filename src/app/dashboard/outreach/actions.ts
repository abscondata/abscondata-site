"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export async function markBatchUploaded(batchId: string) {
  const supabase = await createClient();

  const { error } = await supabase
    .from("outreach_leads")
    .update({
      uploaded_to_instantly: true,
      uploaded_at: new Date().toISOString(),
    })
    .eq("batch_id", batchId)
    .eq("uploaded_to_instantly", false);

  if (error) throw new Error(error.message);

  revalidatePath("/dashboard/outreach");
}

export async function updateLeadResponse(
  leadId: string,
  status: string,
  notes?: string
): Promise<{ success: boolean; message: string }> {
  try {
    const supabase = await createClient();
    // response_status, response_notes, response_date columns added by migration 010
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { error } = await (supabase.from("outreach_leads") as any)
      .update({
        response_status: status,
        response_notes: notes || null,
        response_date: new Date().toISOString(),
      })
      .eq("id", leadId);
    if (error) return { success: false, message: error.message };
    revalidatePath("/dashboard/outreach");
    return { success: true, message: "Lead response updated" };
  } catch (err) {
    return { success: false, message: err instanceof Error ? err.message : "Failed to update lead" };
  }
}

export async function getOutreachStats() {
  const supabase = await createClient();

  const { count: total } = await supabase
    .from("outreach_leads")
    .select("*", { count: "exact", head: true });

  const { count: uploaded } = await supabase
    .from("outreach_leads")
    .select("*", { count: "exact", head: true })
    .eq("uploaded_to_instantly", true);

  const { count: pending } = await supabase
    .from("outreach_leads")
    .select("*", { count: "exact", head: true })
    .eq("uploaded_to_instantly", false);

  return {
    total: total ?? 0,
    uploaded: uploaded ?? 0,
    pending: pending ?? 0,
  };
}
