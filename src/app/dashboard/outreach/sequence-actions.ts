"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type AnyFrom = any;

export async function updateSequence(
  sequenceId: number,
  fields: Record<string, string | boolean>
): Promise<{ success: boolean; message: string }> {
  try {
    const supabase = await createClient();
    const db = supabase as unknown as { from: (table: string) => AnyFrom };
    const { error } = await db.from("email_sequences")
      .update({ ...fields, updated_at: new Date().toISOString() })
      .eq("id", sequenceId);
    if (error) return { success: false, message: error.message };
    revalidatePath("/dashboard/outreach");
    return { success: true, message: "Sequence updated" };
  } catch (err) {
    return { success: false, message: err instanceof Error ? err.message : "Failed to update sequence" };
  }
}

export async function createSequence(
  name: string
): Promise<{ success: boolean; message: string }> {
  try {
    const supabase = await createClient();
    const db = supabase as unknown as { from: (table: string) => AnyFrom };
    const { error } = await db.from("email_sequences").insert({ name, active: false });
    if (error) return { success: false, message: error.message };
    revalidatePath("/dashboard/outreach");
    return { success: true, message: "Sequence created" };
  } catch (err) {
    return { success: false, message: err instanceof Error ? err.message : "Failed to create sequence" };
  }
}
