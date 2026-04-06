"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export async function updateClientNotes(clientId: number, notes: string): Promise<{ success: boolean; message: string }> {
  try {
    const supabase = await createClient();
    const { error } = await supabase
      .from("clients")
      .update({ notes })
      .eq("id", clientId);
    if (error) return { success: false, message: error.message };
    revalidatePath(`/dashboard/clients/${clientId}`);
    return { success: true, message: "Notes saved" };
  } catch (err) {
    return { success: false, message: err instanceof Error ? err.message : "Failed to save notes" };
  }
}

export async function updatePlatformUrl(platformId: string, url: string): Promise<{ success: boolean; message: string }> {
  try {
    const supabase = await createClient();
    // platform_url column added by migration 007 — not yet in generated types
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { error } = await (supabase.from("client_platforms") as any)
      .update({ platform_url: url })
      .eq("id", platformId);
    if (error) return { success: false, message: error.message };
    revalidatePath("/dashboard/clients");
    return { success: true, message: "URL saved" };
  } catch (err) {
    return { success: false, message: err instanceof Error ? err.message : "Failed to save URL" };
  }
}

export async function markSopReviewed(clientId: number, reviewed: boolean): Promise<{ success: boolean; message: string }> {
  try {
    const supabase = await createClient();
    // onboarding_sop_reviewed column added by migration 009
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { error } = await (supabase.from("clients") as any)
      .update({ onboarding_sop_reviewed: reviewed })
      .eq("id", clientId);
    if (error) return { success: false, message: error.message };
    revalidatePath(`/dashboard/clients/${clientId}`);
    return { success: true, message: reviewed ? "SOP marked as reviewed" : "SOP marked as not reviewed" };
  } catch (err) {
    return { success: false, message: err instanceof Error ? err.message : "Failed to update" };
  }
}

export async function setClientActive(clientId: number): Promise<{ success: boolean; message: string }> {
  try {
    const supabase = await createClient();
    const { error } = await supabase
      .from("clients")
      .update({ status: "active" })
      .eq("id", clientId);
    if (error) return { success: false, message: error.message };
    revalidatePath(`/dashboard/clients/${clientId}`);
    revalidatePath("/dashboard/clients");
    return { success: true, message: "Client marked as active" };
  } catch (err) {
    return { success: false, message: err instanceof Error ? err.message : "Failed to update client" };
  }
}

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
