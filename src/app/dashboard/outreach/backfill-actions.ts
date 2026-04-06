"use server";

import { createClient } from "@/lib/supabase/server";
import { classifySegment, generatePersonalizationLine } from "@/lib/lead-classification";
import { revalidatePath } from "next/cache";

export async function backfillLeadSegmentation(): Promise<{ success: boolean; message: string; updated: number }> {
  try {
    const supabase = await createClient();

    // Fetch leads with no segment
    const { data: leads, error: fetchErr } = await supabase
      .from("outreach_leads")
      .select("id, industry, employee_count, company_name")
      .is("segment" as never, null);

    if (fetchErr) return { success: false, message: fetchErr.message, updated: 0 };
    if (!leads || leads.length === 0) return { success: true, message: "All leads already have segments", updated: 0 };

    let updated = 0;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const dbAny = supabase as unknown as { from: (table: string) => any };

    for (const lead of leads) {
      const empNum = lead.employee_count ? parseInt(lead.employee_count, 10) || null : null;
      const segment = classifySegment(lead.industry, empNum);
      const personalizationLine = generatePersonalizationLine(segment, lead.industry, empNum, lead.company_name);

      const { error } = await dbAny.from("outreach_leads")
        .update({ segment, personalization_line: personalizationLine })
        .eq("id", lead.id);

      if (!error) updated++;
    }

    revalidatePath("/dashboard/outreach");
    return { success: true, message: `Backfilled ${updated} leads`, updated };
  } catch (err) {
    return { success: false, message: err instanceof Error ? err.message : "Backfill failed", updated: 0 };
  }
}
