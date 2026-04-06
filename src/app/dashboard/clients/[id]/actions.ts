"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export async function updatePlatformStatus(platformId: string, status: string): Promise<{ success: boolean; message: string }> {
  try {
    const supabase = await createClient();
    const { error } = await supabase
      .from("client_platforms")
      .update({ connection_status: status })
      .eq("id", platformId);
    if (error) return { success: false, message: error.message };
    revalidatePath("/dashboard/clients");
    return { success: true, message: "Platform status updated" };
  } catch (err) {
    return { success: false, message: err instanceof Error ? err.message : "Failed to update platform status" };
  }
}
