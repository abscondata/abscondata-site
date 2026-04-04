"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export async function processImport(
  clientId: number,
  importType: string,
  fileName: string,
  rows: Record<string, string>[]
) {
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

  if (impErr || !imp) throw new Error(impErr?.message || "Failed to create import");

  // Map import type to service key
  const serviceKeyMap: Record<string, string> = {
    overdue_accounts: "payment_followup",
    invoices: "invoice_ops",
    customers: "invoice_ops",
  };
  const serviceKey = serviceKeyMap[importType] || "invoice_ops";

  // Create tasks from rows
  const taskTitleMap: Record<string, (row: Record<string, string>) => string> = {
    overdue_accounts: (row) => `Follow up: ${row.customer || row.name || row.account || "Unknown"} — ${row.amount || row.balance || ""}`,
    invoices: (row) => `Process invoice: ${row.customer || row.name || row.invoice_number || "Unknown"}`,
    customers: (row) => `Review customer: ${row.name || row.customer || row.company || "Unknown"}`,
  };
  const titleFn = taskTitleMap[importType] || ((row) => `Imported: ${Object.values(row)[0] || "row"}`);

  if (rows.length > 0) {
    const tasks = rows.map((row) => ({
      client_id: clientId,
      title: titleFn(row),
      service_key: serviceKey,
      status: "NEW" as const,
      task_type: importType,
      notes: Object.entries(row).map(([k, v]) => `${k}: ${v}`).join(", "),
      source_system: "csv_import",
      source_record_id: imp.id,
    }));

    await supabase.from("tasks").insert(tasks);
  }

  revalidatePath("/dashboard/imports");
  revalidatePath("/dashboard/queue");
  revalidatePath("/dashboard");
  return { importId: imp.id, taskCount: rows.length };
}
