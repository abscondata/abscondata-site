"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export async function convertSubmission(submissionId: string) {
  const supabase = await createClient();

  // Fetch the submission
  const { data: submission, error: fetchErr } = await supabase
    .from("onboarding_submissions")
    .select("*")
    .eq("id", submissionId)
    .single();

  if (fetchErr || !submission) throw new Error("Submission not found");
  if (submission.status !== "pending") throw new Error("Already processed");

  const payload = submission.payload_json as Record<string, unknown>;

  // 1. Create client
  const { data: client, error: clientErr } = await supabase
    .from("clients")
    .insert({
      name: String(payload.company || ""),
      primary_contact_name: String(payload.contact_name || ""),
      primary_contact_email: String(payload.email || ""),
      primary_contact_phone: String(payload.phone || ""),
      niche: String(payload.industry || ""),
      employee_count: payload.employee_count ? parseInt(String(payload.employee_count), 10) || null : null,
      service_area: String(payload.service_area || ""),
      notes: String(payload.notes || ""),
      status: "active",
    })
    .select("id")
    .single();

  if (clientErr || !client) throw new Error(clientErr?.message || "Failed to create client");

  const clientId = client.id;
  const services = (payload.services as string[]) || [];
  const platforms = (payload.platforms as Array<{ key: string; access_method?: string; name?: string }>) || [];

  // 2. Create client_services
  if (services.length > 0) {
    await supabase.from("client_services").insert(
      services.map((key) => ({ client_id: clientId, service_key: key, enabled: true }))
    );
  }

  // 3. Create client_platforms
  if (platforms.length > 0) {
    await supabase.from("client_platforms").insert(
      platforms.map((p) => ({
        client_id: clientId,
        platform_key: p.key,
        connection_method: p.access_method || "pending",
        connection_status: "not_connected",
        notes: p.name || null,
      }))
    );
  }

  // 4. Generate starter tasks from templates for each enabled service
  if (services.length > 0) {
    const { data: templates } = await supabase
      .from("task_templates")
      .select("*")
      .in("service_key", services)
      .order("sort_order", { ascending: true });

    if (templates && templates.length > 0) {
      await supabase.from("tasks").insert(
        templates.map((t) => ({
          client_id: clientId,
          title: t.title,
          notes: t.description,
          service_key: t.service_key,
          status: "NEW" as const,
          task_type: t.service_key,
        }))
      );
    }
  }

  // 5. Update submission
  await supabase
    .from("onboarding_submissions")
    .update({ status: "converted", client_id: clientId })
    .eq("id", submissionId);

  revalidatePath("/dashboard/onboarding");
  revalidatePath("/dashboard/clients");
  revalidatePath("/dashboard");
  return { clientId };
}
