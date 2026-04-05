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
  not_connected: "border-zinc-200 bg-zinc-50 text-zinc-600",
  connected: "border-emerald-200 bg-emerald-50 text-emerald-700",
  error: "border-red-200 bg-red-50 text-red-700",
};

const TASK_STATUS_COLORS: Record<string, string> = {
  NEW: "border-blue-200 bg-blue-50 text-blue-700",
  READY_FOR_REVIEW: "border-amber-200 bg-amber-50 text-amber-700",
  WAITING_ON_MISSING_DATA: "border-orange-200 bg-orange-50 text-orange-700",
  APPROVED: "border-emerald-200 bg-emerald-50 text-emerald-700",
  SENT: "border-violet-200 bg-violet-50 text-violet-700",
  CLOSED: "border-zinc-200 bg-zinc-50 text-zinc-500",
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
    supabase.from("tasks").select("*").eq("client_id", client.id).order("created_at", { ascending: false }).limit(30),
    supabase.from("imports").select("*").eq("client_id", client.id).order("created_at", { ascending: false }).limit(10),
  ]);

  const taskIds = (tasks ?? []).map((t) => t.id);
  const { data: sourceData } = taskIds.length > 0
    ? await supabase.from("task_source_data").select("*").in("task_id", taskIds)
    : { data: [] };
  const sourceMap = Object.fromEntries(
    (sourceData ?? []).map((sd) => [sd.task_id!, sd])
  );

  const activeTasks = (tasks ?? []).filter((t) => t.status !== "CLOSED");
  const closedTasks = (tasks ?? []).filter((t) => t.status === "CLOSED");

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <Link href="/dashboard/clients" className="text-xs text-zinc-400 hover:text-zinc-700">
          &larr; Back to Clients
        </Link>
        <div className="mt-3 flex items-center gap-3">
          <h2 className="text-xl font-semibold text-zinc-900">{client.name}</h2>
          <span className={`rounded-full border px-2.5 py-0.5 text-xs font-semibold ${client.status?.toLowerCase() === "active" ? "border-emerald-200 bg-emerald-50 text-emerald-700" : "border-zinc-200 bg-zinc-50 text-zinc-600"}`}>
            {client.status || "—"}
          </span>
        </div>
        <div className="mt-2 flex flex-wrap gap-x-6 gap-y-1 text-sm text-zinc-600">
          {client.primary_contact_name && <span className="font-medium text-zinc-900">{client.primary_contact_name}</span>}
          {client.primary_contact_email && <span>{client.primary_contact_email}</span>}
          {client.primary_contact_phone && <span>{client.primary_contact_phone}</span>}
          {client.niche && <span className="text-zinc-400">{client.niche}</span>}
          {client.service_area && <span className="text-zinc-400">{client.service_area}</span>}
        </div>
        {client.notes && <p className="mt-2 text-sm italic text-zinc-500">{client.notes}</p>}
      </div>

      {/* Services */}
      <section>
        <h3 className="mb-3 text-[10px] font-semibold uppercase tracking-wider text-zinc-500">Services</h3>
        {(!services || services.length === 0) ? (
          <p className="text-sm text-zinc-400">No services configured.</p>
        ) : (
          <div className="space-y-2">
            {services.map((s) => (
              <div key={s.id} className="flex items-center justify-between rounded-lg border border-zinc-200 bg-white px-4 py-3">
                <span className="text-sm font-medium text-zinc-900">{SERVICE_LABELS[s.service_key] || s.service_key}</span>
                <ServiceToggle serviceId={s.id} enabled={s.enabled} />
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Platforms */}
      <section>
        <h3 className="mb-3 text-[10px] font-semibold uppercase tracking-wider text-zinc-500">Platforms</h3>
        {(!platforms || platforms.length === 0) ? (
          <p className="text-sm text-zinc-400">No platforms configured.</p>
        ) : (
          <div className="space-y-2">
            {platforms.map((p) => (
              <div key={p.id} className="flex items-center justify-between rounded-lg border border-zinc-200 bg-white px-4 py-3">
                <div>
                  <span className="text-sm font-medium text-zinc-900">{PLATFORM_LABELS[p.platform_key] || p.platform_key}</span>
                  {p.connection_method && (
                    <span className="ml-2 text-xs text-zinc-400">({p.connection_method})</span>
                  )}
                  {p.notes && <span className="ml-2 text-xs text-zinc-400">{p.notes}</span>}
                </div>
                <span className={`rounded-full border px-2.5 py-0.5 text-xs font-medium ${STATUS_COLORS[p.connection_status || "not_connected"] || STATUS_COLORS.not_connected}`}>
                  {(p.connection_status || "not_connected").replace(/_/g, " ")}
                </span>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Active Tasks */}
      <section>
        <div className="mb-3 flex items-center justify-between">
          <h3 className="text-[10px] font-semibold uppercase tracking-wider text-zinc-500">Active Tasks ({activeTasks.length})</h3>
          <Link href="/dashboard/queue" className="text-xs font-medium text-zinc-500 hover:text-zinc-900">
            Open Queue →
          </Link>
        </div>
        {activeTasks.length === 0 ? (
          <p className="text-sm text-zinc-400">No active tasks.</p>
        ) : (
          <div className="space-y-2">
            {activeTasks.map((t) => {
              const sd = sourceMap[t.id];
              const normalized = (sd?.normalized_fields_json as Record<string, string | null>) || {};
              return (
                <div key={t.id} className="rounded-lg border border-zinc-200 bg-white px-4 py-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <span className={`rounded-full border px-2 py-0.5 text-[10px] font-semibold ${TASK_STATUS_COLORS[t.status || "NEW"] || TASK_STATUS_COLORS.NEW}`}>
                        {(t.status || "NEW").replace(/_/g, " ")}
                      </span>
                      <span className="text-sm font-medium text-zinc-900">{t.title}</span>
                    </div>
                    <span className="text-xs text-zinc-400">{SERVICE_LABELS[t.service_key || ""] || t.service_key || "—"}</span>
                  </div>
                  {(normalized.customer_name || normalized.amount || normalized.invoice_number) && (
                    <div className="mt-1.5 flex flex-wrap gap-x-4 gap-y-0.5 text-xs text-zinc-500">
                      {normalized.customer_name && <span className="font-medium text-zinc-700">{normalized.customer_name}</span>}
                      {normalized.invoice_number && <span>Inv #{normalized.invoice_number}</span>}
                      {normalized.amount && <span>${normalized.amount}</span>}
                      {normalized.days_overdue && <span className="text-red-600">{normalized.days_overdue} days overdue</span>}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </section>

      {/* Closed Tasks */}
      {closedTasks.length > 0 && (
        <section>
          <details>
            <summary className="cursor-pointer text-[10px] font-semibold uppercase tracking-wider text-zinc-400 hover:text-zinc-600">
              Closed Tasks ({closedTasks.length})
            </summary>
            <div className="mt-2 space-y-1">
              {closedTasks.map((t) => (
                <div key={t.id} className="flex items-center justify-between rounded-lg border border-zinc-100 bg-zinc-50 px-3 py-2">
                  <span className="text-xs text-zinc-500">{t.title}</span>
                  <span className="text-[10px] text-zinc-400">{t.sent_at ? new Date(t.sent_at).toLocaleDateString() : ""}</span>
                </div>
              ))}
            </div>
          </details>
        </section>
      )}

      {/* Imports */}
      <section>
        <div className="mb-3 flex items-center justify-between">
          <h3 className="text-[10px] font-semibold uppercase tracking-wider text-zinc-500">Import History</h3>
          <Link href="/dashboard/imports" className="text-xs font-medium text-zinc-500 hover:text-zinc-900">
            Import Data →
          </Link>
        </div>
        {(!imports || imports.length === 0) ? (
          <p className="text-sm text-zinc-400">No imports yet.</p>
        ) : (
          <div className="space-y-2">
            {imports.map((imp) => (
              <div key={imp.id} className="flex items-center justify-between rounded-lg border border-zinc-200 bg-white px-4 py-3">
                <div>
                  <span className="text-sm font-medium text-zinc-900">{imp.import_type}</span>
                  {imp.source_name && <span className="ml-2 text-xs text-zinc-500">{imp.source_name}</span>}
                  <span className="ml-2 text-xs text-zinc-400">{imp.row_count} rows</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className={`rounded-full border px-2 py-0.5 text-xs font-medium ${imp.status === "completed" ? "border-emerald-200 bg-emerald-50 text-emerald-700" : "border-zinc-200 bg-zinc-50 text-zinc-600"}`}>
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
