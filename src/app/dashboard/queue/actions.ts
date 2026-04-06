"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import type { Database } from "@/lib/database.types";

type TaskStatus = Database["public"]["Enums"]["task_status"];

// Valid transitions
const VALID_TRANSITIONS: Record<string, TaskStatus[]> = {
  NEW: ["READY_FOR_REVIEW", "WAITING_ON_MISSING_DATA", "EXCEPTION"],
  WAITING_ON_MISSING_DATA: ["READY_FOR_REVIEW", "EXCEPTION"],
  READY_FOR_REVIEW: ["APPROVED", "EXCEPTION"],
  APPROVED: ["SENT", "EXCEPTION"],
  SENT: ["CLOSED", "EXCEPTION"],
};

export async function updateTaskStatus(
  taskId: number,
  newStatus: TaskStatus,
  extra?: { rejection_reason?: string; ai_draft?: string; edited_draft?: string; notes?: string }
): Promise<{ success: boolean; message: string }> {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    // Fetch current task to validate transition
    const { data: task } = await supabase.from("tasks").select("status, ai_draft, edited_draft").eq("id", taskId).single();
    if (!task) return { success: false, message: "Task not found" };

    const currentStatus = task.status || "NEW";
    const allowed = VALID_TRANSITIONS[currentStatus];
    if (!allowed || !allowed.includes(newStatus)) {
      return { success: false, message: `Invalid transition: ${currentStatus} to ${newStatus}` };
    }

    const updates: Record<string, unknown> = { status: newStatus, updated_at: new Date().toISOString() };

    if (newStatus === "APPROVED") {
      updates.approved_at = new Date().toISOString();
      const finalEdited = extra?.edited_draft || task.edited_draft;
      if (!finalEdited) {
        updates.edited_draft = extra?.ai_draft || task.ai_draft || "";
      }
    }
    if (newStatus === "SENT") updates.sent_at = new Date().toISOString();
    if (newStatus === "EXCEPTION" && extra?.rejection_reason) {
      updates.exception_reason_code = "rejected";
      updates.exception_description = extra.rejection_reason;
      updates.rejection_reason = extra.rejection_reason;
    }
    if (extra?.ai_draft !== undefined) updates.ai_draft = extra.ai_draft;
    if (extra?.edited_draft !== undefined) updates.edited_draft = extra.edited_draft;

    const { error } = await supabase.from("tasks").update(updates).eq("id", taskId);
    if (error) return { success: false, message: error.message };

    let eventNotes = extra?.rejection_reason ? `Rejected: ${extra.rejection_reason}` : null;
    if (extra?.notes) eventNotes = extra.notes;

    await supabase.from("task_events").insert({
      task_id: taskId,
      event_type: `status_change:${currentStatus}→${newStatus}`,
      actor_type: "user",
      actor_id: user?.id || null,
      notes: eventNotes,
    });

    revalidatePath("/dashboard/queue");
    revalidatePath("/dashboard");

    const statusLabels: Record<string, string> = {
      READY_FOR_REVIEW: "Task moved to review",
      WAITING_ON_MISSING_DATA: "Task marked as waiting",
      APPROVED: "Task approved",
      SENT: "Task marked as sent",
      CLOSED: "Task closed",
      EXCEPTION: "Task rejected",
    };
    return { success: true, message: statusLabels[newStatus] || "Status updated" };
  } catch (err) {
    return { success: false, message: err instanceof Error ? err.message : "Failed to update status" };
  }
}

export async function updateTaskDraft(taskId: number, draft: string, field: "ai_draft" | "edited_draft" = "ai_draft"): Promise<{ success: boolean; message: string }> {
  try {
    const supabase = await createClient();
    const { error } = await supabase.from("tasks").update({ [field]: draft }).eq("id", taskId);
    if (error) return { success: false, message: error.message };
    return { success: true, message: "Draft saved" };
  } catch (err) {
    return { success: false, message: err instanceof Error ? err.message : "Failed to save draft" };
  }
}

export async function createManualTask(
  clientId: number,
  serviceKey: string,
  recipient: { name?: string; email?: string; phone?: string },
  sourceNotes: string,
  title: string
): Promise<{ success: boolean; message: string; taskId?: number }> {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    const { data: task, error } = await supabase
      .from("tasks")
      .insert({
        client_id: clientId,
        service_key: serviceKey,
        task_type: serviceKey,
        title,
        status: "NEW" as const,
        recipient_name: recipient.name || null,
        recipient_email: recipient.email || null,
        source_system: "manual",
        notes: sourceNotes || null,
      })
      .select("id")
      .single();

    if (error || !task) return { success: false, message: error?.message || "Failed to create task" };

    if (sourceNotes) {
      await supabase.from("task_source_data").insert({
        task_id: task.id,
        payload_json: {
          customer_name: recipient.name || null,
          customer_email: recipient.email || null,
          customer_phone: recipient.phone || null,
          notes: sourceNotes,
        },
        normalized_fields_json: {
          customer_name: recipient.name || null,
          customer_email: recipient.email || null,
          customer_phone: recipient.phone || null,
          notes: sourceNotes,
        },
      });
    }

    await supabase.from("task_events").insert({
      task_id: task.id,
      event_type: "task_created",
      actor_type: "user",
      actor_id: user?.id || null,
      notes: `Manual task: ${title}`,
    });

    revalidatePath("/dashboard/queue");
    revalidatePath("/dashboard");
    return { success: true, message: "Task created", taskId: task.id };
  } catch (err) {
    return { success: false, message: err instanceof Error ? err.message : "Failed to create task" };
  }
}
