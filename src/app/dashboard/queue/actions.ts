"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import type { Database } from "@/lib/database.types";

type TaskStatus = Database["public"]["Enums"]["task_status"];

export async function updateTaskStatus(
  taskId: number,
  newStatus: TaskStatus,
  extra?: { rejection_reason?: string; ai_draft?: string; edited_draft?: string }
) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  const updates: Record<string, unknown> = { status: newStatus, updated_at: new Date().toISOString() };

  if (newStatus === "APPROVED") updates.approved_at = new Date().toISOString();
  if (newStatus === "SENT") updates.sent_at = new Date().toISOString();
  if (extra?.rejection_reason) updates.rejection_reason = extra.rejection_reason;
  if (extra?.ai_draft !== undefined) updates.ai_draft = extra.ai_draft;
  if (extra?.edited_draft !== undefined) updates.edited_draft = extra.edited_draft;

  const { error } = await supabase.from("tasks").update(updates).eq("id", taskId);
  if (error) throw new Error(error.message);

  // Log event
  await supabase.from("task_events").insert({
    task_id: taskId,
    event_type: `status_change:${newStatus}`,
    actor_type: "user",
    actor_id: user?.id || null,
    notes: extra?.rejection_reason ? `Rejected: ${extra.rejection_reason}` : null,
  });

  revalidatePath("/dashboard/queue");
  revalidatePath("/dashboard");
}

export async function updateTaskDraft(taskId: number, draft: string, field: "ai_draft" | "edited_draft" = "ai_draft") {
  const supabase = await createClient();
  const { error } = await supabase.from("tasks").update({ [field]: draft }).eq("id", taskId);
  if (error) throw new Error(error.message);
}
