import { createClient } from "@/lib/supabase/server";
import { redirect, notFound } from "next/navigation";
import Link from "next/link";
import { ServiceToggle } from "./service-toggle";

const SERVICE_LABELS: Record<string, string> = {
  invoice_ops: "Invoice Operations",
  payment_followup: "Payment Follow-Up",
  review_requests: "Review Requests",
  weekly_summary: "Weekly Business Summary",
  lead_intake: "Lead & Intake Admin",
};

const PLATFORM_LABELS: Record<string, string> = {
  quickbooks: "QuickBooks",
  jobber: "Jobber",
  servicetitan: "ServiceTitan",
  housecall_pro: "Housecall Pro",
  google_workspace: "Google Workspace",
  outlook_365: "Outlook / Office 365",
  other: "Other",
};

const STATUS_COLORS: Record<string, string> = {
  not_connected: "bg-zinc-100 text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400",
  connected: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
  error: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
};

export default async function ClientDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: profile } = await supabase.from("profiles").select("*").eq("id", user.id).single();
  if (profile?.role !== "owner") redirect("/dashboard");

  const { data: client } = await supabase.from("clients").select("*").eq("id", Number(id)).single();
  if (!client) notFound();

  const [
    { data: services },
    { data: platforms },
    { data: tasks },
    { data: imports },
  ] = await Promise.all([
    supabase.from("client_services").select("*").eq("client_id", client.id).order("service_key"),
    supabase.from("client_platforms").select("*").eq("client_id", client.id).order("platform_key"),
    supabase.from("tasks").select("*").eq("client_id", client.id).neq("status", "CLOSED").order("created_at", { ascending: false }).limit(20),
    supabase.from("imports").select("*").eq("client_id", client.id).order("created_at", { ascending: false }).limit(10),
  ]);

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <Link href="/dashboard/clients" className="text-xs text-zinc-500 hover:text-zinc-700 dark:text-zinc-400 dark:hover:text-zinc-200">
          &larr; Back to Clients
        </Link>
        <div className="mt-3 flex items-center gap-3">
          <h2 className="text-xl font-semibold text-zinc-900 dark:text-zinc-100">{client.name}</h2>
          <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${client.status?.toLowerCase() === "active" ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400" : "bg-zinc-100 text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400"}`}>
            {client.status || "—"}
          </span>
        </div>
        <div className="mt-2 flex flex-wrap gap-x-6 gap-y-1 text-sm text-zinc-500 dark:text-zinc-400">
          {client.primary_contact_name && <span>{client.primary_contact_name}</span>}
          {client.primary_contact_email && <span>{client.primary_contact_email}</span>}
          {client.primary_contact_phone && <span>{client.primary_contact_phone}</span>}
          {client.niche && <span>{client.niche}</span>}
          {client.service_area && <span>{client.service_area}</span>}
        </div>
        {client.notes && <p className="mt-2 text-sm text-zinc-500 dark:text-zinc-400 italic">{client.notes}</p>}
      </div>

      {/* Services */}
      <section>
        <h3 className="mb-3 text-sm font-semibold text-zinc-900 dark:text-zinc-100">Services</h3>
        {(!services || services.length === 0) ? (
          <p className="text-sm text-zinc-500">No services configured.</p>
        ) : (
          <div className="space-y-2">
            {services.map((s) => (
              <div key={s.id} className="flex items-center justify-between rounded-lg border border-zinc-200 bg-white px-4 py-3 dark:border-zinc-800 dark:bg-zinc-900">
                <span className="text-sm text-zinc-900 dark:text-zinc-100">{SERVICE_LABELS[s.service_key] || s.service_key}</span>
                <ServiceToggle serviceId={s.id} enabled={s.enabled} />
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Platforms */}
      <section>
        <h3 className="mb-3 text-sm font-semibold text-zinc-900 dark:text-zinc-100">Platforms</h3>
        {(!platforms || platforms.length === 0) ? (
          <p className="text-sm text-zinc-500">No platforms configured.</p>
        ) : (
          <div className="space-y-2">
            {platforms.map((p) => (
              <div key={p.id} className="flex items-center justify-between rounded-lg border border-zinc-200 bg-white px-4 py-3 dark:border-zinc-800 dark:bg-zinc-900">
                <div>
                  <span className="text-sm text-zinc-900 dark:text-zinc-100">{PLATFORM_LABELS[p.platform_key] || p.platform_key}</span>
                  {p.connection_method && (
                    <span className="ml-2 text-xs text-zinc-500 dark:text-zinc-400">({p.connection_method})</span>
                  )}
                  {p.notes && <span className="ml-2 text-xs text-zinc-400">{p.notes}</span>}
                </div>
                <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${STATUS_COLORS[p.connection_status || "not_connected"] || STATUS_COLORS.not_connected}`}>
                  {p.connection_status || "not_connected"}
                </span>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Tasks */}
      <section>
        <h3 className="mb-3 text-sm font-semibold text-zinc-900 dark:text-zinc-100">Active Tasks</h3>
        {(!tasks || tasks.length === 0) ? (
          <p className="text-sm text-zinc-500">No active tasks.</p>
        ) : (
          <div className="overflow-x-auto rounded-lg border border-zinc-200 dark:border-zinc-800">
            <table className="w-full text-left text-sm">
              <thead className="border-b border-zinc-200 bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-900">
                <tr>
                  {["Title", "Service", "Status", "Due"].map((h) => (
                    <th key={h} className="px-4 py-2 font-medium text-zinc-600 dark:text-zinc-400">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800">
                {tasks.map((t) => (
                  <tr key={t.id} className="bg-white dark:bg-zinc-900/50">
                    <td className="px-4 py-2 text-zinc-900 dark:text-zinc-100">{t.title}</td>
                    <td className="px-4 py-2 text-zinc-500 dark:text-zinc-400">{SERVICE_LABELS[t.service_key || ""] || t.service_key || "—"}</td>
                    <td className="px-4 py-2 text-zinc-500 dark:text-zinc-400">{t.status || "—"}</td>
                    <td className="px-4 py-2 text-zinc-500 dark:text-zinc-400">{t.due_at ? new Date(t.due_at).toLocaleDateString("en-US", { month: "short", day: "numeric" }) : "—"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

      {/* Imports */}
      <section>
        <h3 className="mb-3 text-sm font-semibold text-zinc-900 dark:text-zinc-100">Import History</h3>
        {(!imports || imports.length === 0) ? (
          <p className="text-sm text-zinc-500">No imports yet.</p>
        ) : (
          <div className="space-y-2">
            {imports.map((imp) => (
              <div key={imp.id} className="flex items-center justify-between rounded-lg border border-zinc-200 bg-white px-4 py-3 dark:border-zinc-800 dark:bg-zinc-900">
                <div>
                  <span className="text-sm text-zinc-900 dark:text-zinc-100">{imp.import_type}</span>
                  {imp.source_name && <span className="ml-2 text-xs text-zinc-500">{imp.source_name}</span>}
                  <span className="ml-2 text-xs text-zinc-400">{imp.row_count} rows</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${imp.status === "completed" ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400" : "bg-zinc-100 text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400"}`}>
                    {imp.status}
                  </span>
                  <span className="text-xs text-zinc-400">{new Date(imp.created_at).toLocaleDateString()}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
