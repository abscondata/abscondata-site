"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

// client_invoices table added by migration 008 — not in generated types
// eslint-disable-next-line @typescript-eslint/no-explicit-any
type AnyFrom = any;

export async function createInvoice(
  clientId: number,
  invoiceDate: string,
  amount: number,
  status: string,
  notes: string
): Promise<{ success: boolean; message: string }> {
  try {
    const supabase = await createClient();
    const db = supabase as unknown as { from: (table: string) => AnyFrom };
    const { error } = await db.from("client_invoices").insert({
      client_id: clientId,
      invoice_date: invoiceDate,
      amount,
      status,
      notes: notes || null,
    });
    if (error) return { success: false, message: error.message };
    revalidatePath(`/dashboard/clients/${clientId}`);
    return { success: true, message: "Invoice added" };
  } catch (err) {
    return { success: false, message: err instanceof Error ? err.message : "Failed to add invoice" };
  }
}

export async function updateInvoiceStatus(
  invoiceId: number,
  status: string
): Promise<{ success: boolean; message: string }> {
  try {
    const supabase = await createClient();
    const db = supabase as unknown as { from: (table: string) => AnyFrom };
    const { error } = await db.from("client_invoices").update({ status }).eq("id", invoiceId);
    if (error) return { success: false, message: error.message };
    revalidatePath("/dashboard/clients");
    return { success: true, message: "Invoice status updated" };
  } catch (err) {
    return { success: false, message: err instanceof Error ? err.message : "Failed to update invoice" };
  }
}
