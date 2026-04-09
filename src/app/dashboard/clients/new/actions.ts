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
  platforms: { key: string; url?: string }[];
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
    const warnings: string[] = [];

    if (data.services.length > 0) {
      const { error: servicesErr } = await supabase.from("client_services").insert(
        data.services.map((key) => ({ client_id: clientId, service_key: key, enabled: true }))
      );
      if (servicesErr) {
        console.error("[createClientManual] client_services insert failed", { clientId, error: servicesErr.message });
        warnings.push(`services not saved: ${servicesErr.message}`);
      }
    }

    if (data.platforms.length > 0) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const { error: platformsErr } = await (supabase.from("client_platforms") as any).insert(
        data.platforms.map((p) => ({
          client_id: clientId,
          platform_key: p.key,
          connection_method: "pending",
          connection_status: "not_connected",
          platform_url: p.url || null,
        }))
      );
      if (platformsErr) {
        console.error("[createClientManual] client_platforms insert failed", { clientId, error: platformsErr.message });
        warnings.push(`platforms not saved: ${platformsErr.message}`);
      }
    }

    if (data.services.length > 0) {
      const { data: templates, error: templatesErr } = await supabase
        .from("task_templates")
        .select("*")
        .in("service_key", data.services)
        .order("sort_order", { ascending: true });

      if (templatesErr) {
        console.error("[createClientManual] task_templates fetch failed", { error: templatesErr.message });
        warnings.push(`templates fetch failed: ${templatesErr.message}`);
      } else if (templates && templates.length > 0) {
        const { error: tasksErr } = await supabase.from("tasks").insert(
          templates.map((t) => ({
            client_id: clientId,
            title: t.title,
            notes: t.description,
            service_key: t.service_key,
            status: "NEW" as const,
            task_type: t.service_key,
          }))
        );
        if (tasksErr) {
          console.error("[createClientManual] starter tasks insert failed", { clientId, error: tasksErr.message });
          warnings.push(`starter tasks not created: ${tasksErr.message}`);
        }
      }
    }

    revalidatePath("/dashboard/clients");
    revalidatePath("/dashboard/queue");
    revalidatePath("/dashboard");
    const message = warnings.length > 0
      ? `Client created (warnings: ${warnings.join("; ")})`
      : "Client created";
    return { success: true, message, clientId };
  } catch (err) {
    return { success: false, message: err instanceof Error ? err.message : "Failed to create client" };
  }
}
