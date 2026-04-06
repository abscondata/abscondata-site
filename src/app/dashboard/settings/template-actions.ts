"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export async function updateTemplate(
  templateId: string,
  fields: { title?: string; description?: string; sort_order?: number }
): Promise<{ success: boolean; message: string }> {
  try {
    const supabase = await createClient();
    const { error } = await supabase
      .from("task_templates")
      .update(fields)
      .eq("id", templateId);
    if (error) return { success: false, message: error.message };
    revalidatePath("/dashboard/settings");
    return { success: true, message: "Template updated" };
  } catch (err) {
    return { success: false, message: err instanceof Error ? err.message : "Failed to update template" };
  }
}

export async function createTemplate(
  serviceKey: string,
  title: string,
  description: string,
  requiresReview: boolean
): Promise<{ success: boolean; message: string }> {
  try {
    const supabase = await createClient();
    // Get max sort_order for this service
    const { data: existing } = await supabase
      .from("task_templates")
      .select("sort_order")
      .eq("service_key", serviceKey)
      .order("sort_order", { ascending: false })
      .limit(1);
    const nextOrder = ((existing?.[0]?.sort_order ?? 0) + 1);

    const { error } = await supabase.from("task_templates").insert({
      service_key: serviceKey,
      title,
      description: description || null,
      requires_review: requiresReview,
      sort_order: nextOrder,
    });
    if (error) return { success: false, message: error.message };
    revalidatePath("/dashboard/settings");
    revalidatePath("/dashboard/queue");
    return { success: true, message: "Template created" };
  } catch (err) {
    return { success: false, message: err instanceof Error ? err.message : "Failed to create template" };
  }
}

export async function toggleTemplateEnabled(
  templateId: string,
  enabled: boolean
): Promise<{ success: boolean; message: string }> {
  try {
    const supabase = await createClient();
    // enabled column added by migration — use type assertion
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { error } = await (supabase.from("task_templates") as any)
      .update({ enabled })
      .eq("id", templateId);
    if (error) return { success: false, message: error.message };
    revalidatePath("/dashboard/settings");
    revalidatePath("/dashboard/queue");
    return { success: true, message: enabled ? "Template enabled" : "Template disabled" };
  } catch (err) {
    return { success: false, message: err instanceof Error ? err.message : "Failed to toggle template" };
  }
}
