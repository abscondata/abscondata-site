"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export async function updatePlatformStatus(platformId: string, status: string) {
  const supabase = await createClient();
  const { error } = await supabase
    .from("client_platforms")
    .update({ connection_status: status })
    .eq("id", platformId);
  if (error) throw new Error(error.message);
  revalidatePath("/dashboard/clients");
}
