"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export async function processImport(
  clientId: number,
  importType: string,
  fileName: string,
  rows: Record<string, string>[]
): Promise<{ success: boolean; message: string; importId?: string; taskCount?: number }> {
  try {
  const supabase = await createClient();

  // Create import record
  const { data: imp, error: impErr } = await supabase
    .from("imports")
    .insert({
      client_id: clientId,
      import_type: importType,
      source_name: fileName,
      status: "completed",
      row_count: rows.length,
      summary_json: { columns: rows.length > 0 ? Object.keys(rows[0]) : [], sample: rows.slice(0, 3) },
    })
    .select("id")
    .single();

  if (impErr || !imp) return { success: false, message: impErr?.message || "Failed to create import" };

  // Map import type to service key
  const serviceKeyMap: Record<string, string> = {
    overdue_accounts: "payment_followup",
    invoices: "invoice_ops",
    customers: "invoice_ops",
  };
  const serviceKey = serviceKeyMap[importType] || "invoice_ops";

  // Normalize column names from CSV to known fields
  function normalizeRow(row: Record<string, string>) {
    const r = Object.fromEntries(
      Object.entries(row).map(([k, v]) => [k.toLowerCase().replace(/\s+/g, "_"), v])
    );
    return {
      customer_name: r.customer_name || r.customer || r.name || r.account || r.company || null,
      customer_email: r.customer_email || r.email || null,
      customer_phone: r.customer_phone || r.phone || null,
      invoice_number: r.invoice_number || r.invoice || r.inv || r.invoice_no || null,
      amount: r.amount || r.balance || r.total || r.amount_due || null,
      due_date: r.due_date || r.date_due || r.due || null,
      days_overdue: r.days_overdue || r.overdue_days || r.aging || null,
      notes: r.notes || r.note || r.comments || null,
    };
  }

  // Build task titles
  const taskTitleMap: Record<string, (n: ReturnType<typeof normalizeRow>) => string> = {
    overdue_accounts: (n) => `Follow up: ${n.customer_name || "Unknown"} — ${n.amount || ""}`.trim(),
    invoices: (n) => `Process invoice: ${n.customer_name || n.invoice_number || "Unknown"}`,
    customers: (n) => `Review customer: ${n.customer_name || "Unknown"}`,
  };
  const titleFn = taskTitleMap[importType] || ((n: ReturnType<typeof normalizeRow>) => `Imported: ${n.customer_name || "row"}`);

  if (rows.length > 0) {
    // Insert tasks
    const tasksToInsert = rows.map((row) => {
      const normalized = normalizeRow(row);
      return {
        client_id: clientId,
        title: titleFn(normalized),
        service_key: serviceKey,
        status: "NEW" as const,
        task_type: importType,
        recipient_name: normalized.customer_name,
        recipient_email: normalized.customer_email,
        source_system: "csv_import",
        source_record_id: imp.id,
      };
    });

    const { data: createdTasks } = await supabase
      .from("tasks")
      .insert(tasksToInsert)
      .select("id");

    // Insert task_source_data for each task with the full row payload + normalized fields
    if (createdTasks && createdTasks.length > 0) {
      const sourceDataRows = createdTasks.map((task, i) => ({
        task_id: task.id,
        payload_json: rows[i],
        normalized_fields_json: normalizeRow(rows[i]),
      }));
      await supabase.from("task_source_data").insert(sourceDataRows);
    }
  }

  revalidatePath("/dashboard/imports");
  revalidatePath("/dashboard/queue");
  revalidatePath("/dashboard");
  return { success: true, message: `Import complete — ${rows.length} tasks created`, importId: imp.id, taskCount: rows.length };
  } catch (err) {
    return { success: false, message: err instanceof Error ? err.message : "Import failed" };
  }
}
