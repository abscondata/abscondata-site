"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export async function createSop(
  title: string,
  serviceKey: string,
  content: string
): Promise<{ success: boolean; message: string; sopId?: number }> {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("sops")
      .insert({
        title,
        trigger: serviceKey,
        steps: content,
        active: true,
      })
      .select("id")
      .single();

    if (error || !data) return { success: false, message: error?.message || "Failed to create SOP" };

    revalidatePath("/dashboard/sops");
    return { success: true, message: "SOP created", sopId: data.id };
  } catch (err) {
    return { success: false, message: err instanceof Error ? err.message : "Failed to create SOP" };
  }
}

export async function updateSop(
  sopId: number,
  title: string,
  content: string
): Promise<{ success: boolean; message: string }> {
  try {
    const supabase = await createClient();
    const { error } = await supabase
      .from("sops")
      .update({ title, steps: content })
      .eq("id", sopId);

    if (error) return { success: false, message: error.message };

    revalidatePath("/dashboard/sops");
    return { success: true, message: "SOP updated" };
  } catch (err) {
    return { success: false, message: err instanceof Error ? err.message : "Failed to update SOP" };
  }
}
