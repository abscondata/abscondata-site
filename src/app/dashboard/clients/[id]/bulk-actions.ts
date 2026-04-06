"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

interface BulkRow {
  recipient_name: string;
  recipient_email: string;
  amount: string;
  notes: string;
}

export async function bulkCreateTasks(
  clientId: number,
  serviceKey: string,
  rows: BulkRow[]
) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  // Get the first template for this service to use as title prefix
  const { data: templates } = await supabase
    .from("task_templates")
    .select("title")
    .eq("service_key", serviceKey)
    .order("sort_order", { ascending: true })
    .limit(1);

  const titlePrefix = templates?.[0]?.title || serviceKey.replace(/_/g, " ");

  const tasksToInsert = rows.map((row) => ({
    client_id: clientId,
    service_key: serviceKey,
    task_type: serviceKey,
    title: `${titlePrefix}: ${row.recipient_name}${row.amount ? ` ($${row.amount})` : ""}`,
    status: "NEW" as const,
    recipient_name: row.recipient_name || null,
    recipient_email: row.recipient_email || null,
    source_system: "manual_bulk",
    notes: row.notes || null,
  }));

  const { data: createdTasks, error } = await supabase
    .from("tasks")
    .insert(tasksToInsert)
    .select("id");

  if (error) throw new Error(`Insert failed: ${error.message}`);

  // Insert source data and events for each task
  if (createdTasks && createdTasks.length > 0) {
    const sourceRows = createdTasks.map((task, i) => ({
      task_id: task.id,
      payload_json: rows[i] as unknown as Record<string, string>,
      normalized_fields_json: {
        customer_name: rows[i].recipient_name || null,
        customer_email: rows[i].recipient_email || null,
        amount: rows[i].amount || null,
        notes: rows[i].notes || null,
      },
    }));
    await supabase.from("task_source_data").insert(sourceRows);

    const eventRows = createdTasks.map((task) => ({
      task_id: task.id,
      event_type: "task_created",
      actor_type: "user",
      actor_id: user?.id || null,
      notes: "Bulk created",
    }));
    await supabase.from("task_events").insert(eventRows);
  }

  revalidatePath("/dashboard/queue");
  revalidatePath(`/dashboard/clients/${clientId}`);
  revalidatePath("/dashboard");

  return { count: createdTasks?.length ?? 0 };
}
