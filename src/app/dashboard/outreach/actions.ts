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
