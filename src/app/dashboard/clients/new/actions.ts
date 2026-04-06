"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

interface NewClientData {
  name: string;
  contact_name: string;
  email: string;
  phone: string;
  industry: string;
  employee_count: string;
  service_area: string;
  notes: string;
  services: string[];
  platforms: string[];
}

export async function createClientManual(data: NewClientData): Promise<{ success: boolean; message: string; clientId?: number }> {
  try {
    const supabase = await createClient();

    const { data: client, error: clientErr } = await supabase
      .from("clients")
      .insert({
        name: data.name,
        primary_contact_name: data.contact_name || null,
        primary_contact_email: data.email || null,
        primary_contact_phone: data.phone || null,
        niche: data.industry || null,
        employee_count: data.employee_count ? parseInt(data.employee_count, 10) || null : null,
        service_area: data.service_area || null,
        notes: data.notes || null,
        status: "active",
      })
      .select("id")
      .single();

    if (clientErr || !client) return { success: false, message: clientErr?.message || "Failed to create client" };

    const clientId = client.id;

    if (data.services.length > 0) {
      await supabase.from("client_services").insert(
        data.services.map((key) => ({ client_id: clientId, service_key: key, enabled: true }))
      );
    }

    if (data.platforms.length > 0) {
      await supabase.from("client_platforms").insert(
        data.platforms.map((key) => ({
          client_id: clientId,
          platform_key: key,
          connection_method: "pending",
          connection_status: "not_connected",
        }))
      );
    }

    if (data.services.length > 0) {
      const { data: templates } = await supabase
        .from("task_templates")
        .select("*")
        .in("service_key", data.services)
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

    revalidatePath("/dashboard/clients");
    revalidatePath("/dashboard/queue");
    revalidatePath("/dashboard");
    return { success: true, message: "Client created", clientId };
  } catch (err) {
    return { success: false, message: err instanceof Error ? err.message : "Failed to create client" };
  }
}
