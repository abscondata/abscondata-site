import { createClient } from "@/lib/supabase/server";
import { redirect, notFound } from "next/navigation";
import Link from "next/link";
import { EmptyState } from "../../components/ui";
import { ServiceToggle } from "./service-toggle";
import { PlatformStatusDropdown } from "./platform-status";
import { WeeklySummary } from "./weekly-summary";
import { BulkTaskForm } from "./bulk-tasks";
import { CompletedWork } from "./completed-work";
import { SummaryCard } from "./summary-card";
import { TaskQuickActions } from "./task-quick-actions";
import { BatchDraftButton } from "./batch-draft-button";

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

  // Weekly summary data
  const now = new Date();
  const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
  const weekStart = weekAgo.toLocaleDateString("en-US", { month: "short", day: "numeric" });
  const weekEnd = now.toLocaleDateString("en-US", { month: "short", day: "numeric" });

  const allTasks = tasks ?? [];
  const createdThisWeek = allTasks.filter((t) => new Date(t.created_at) >= weekAgo).length;
  const completedThisWeek = allTasks.filter((t) =>
    (t.status === "SENT" || t.status === "CLOSED") &&
    (t.sent_at ? new Date(t.sent_at) >= weekAgo : false)
  );
  const openByStatus: Record<string, number> = {};
  for (const t of activeTasks) {
    const s = t.status || "NEW";
    openByStatus[s] = (openByStatus[s] || 0) + 1;
  }
  const completedTasksList = completedThisWeek.map((t) => ({
    id: t.id,
    title: t.title,
    completedAt: t.sent_at || t.updated_at || t.created_at,
    serviceKey: t.service_key,
  }));

  // Completed work data (SENT + CLOSED tasks)
  const completedWorkTasks = closedTasks
    .sort((a, b) => {
      const da = a.sent_at || a.updated_at || a.created_at;
      const db = b.sent_at || b.updated_at || b.created_at;
      return new Date(db).getTime() - new Date(da).getTime();
    })
    .map((t) => ({
      id: t.id,
      title: t.title,
      serviceKey: t.service_key,
      recipientName: t.recipient_name,
      recipientEmail: t.recipient_email,
      sentAt: t.sent_at || t.updated_at || null,
    }));

  // Summary card data
  const enabledServices = (services ?? []).filter((s) => s.enabled).map((s) => s.service_key);
  const connectedPlatforms = (platforms ?? []).filter((p) => p.connection_status === "connected").length;
  const totalPlatforms = (platforms ?? []).length;
  const summaryCompletedTasks = completedThisWeek.map((t) => ({
    title: t.title,
    date: new Date(t.sent_at || t.updated_at || t.created_at).toLocaleDateString("en-US", { month: "short", day: "numeric" }),
  }));

  // Task counts by status
  const statusCounts: Record<string, number> = {};
  for (const t of activeTasks) {
    const s = t.status || "NEW";
    statusCounts[s] = (statusCounts[s] || 0) + 1;
  }

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
          <SummaryCard
            clientName={client.name}
            niche={client.niche}
            services={enabledServices}
            platformsConnected={connectedPlatforms}
            platformsTotal={totalPlatforms}
            weekLabel={weekStart}
            completedCount={completedThisWeek.length}
            completedTasks={summaryCompletedTasks}
          />
        </div>
        <div className="mt-2 flex flex-wrap gap-x-6 gap-y-1 text-sm text-zinc-600">
          {client.primary_contact_name && <span className="font-medium text-zinc-900">{client.primary_contact_name}</span>}
          {client.primary_contact_email && <span>{client.primary_contact_email}</span>}
          {client.primary_contact_phone && <span>{client.primary_contact_phone}</span>}
          {client.niche && <span className="text-zinc-400">{client.niche}</span>}
          {client.service_area && <span className="text-zinc-400">{client.service_area}</span>}
        </div>
        {client.notes && <p className="mt-2 text-sm italic text-zinc-500">{client.notes}</p>}
        {/* Task status summary */}
        {activeTasks.length > 0 && (
          <div className="mt-3 flex flex-wrap gap-x-4 gap-y-1 text-xs text-zinc-500">
            {Object.entries(statusCounts).map(([s, count]) => (
              <span key={s}>{s.replace(/_/g, " ")}: <span className="font-semibold text-zinc-700">{count}</span></span>
            ))}
            <span>Closed: <span className="font-semibold text-zinc-700">{closedTasks.length}</span></span>
          </div>
        )}
      </div>

      {/* Onboarding Progress */}
      {platforms && platforms.length > 0 && (() => {
        const connected = platforms.filter((p) => p.connection_status === "connected").length;
        const total = platforms.length;
        const allConnected = connected === total;

        if (allConnected) return null;

        const statusDot: Record<string, string> = {
          connected: "bg-emerald-500",
          credentials_received: "bg-amber-400",
          error: "bg-red-500",
          not_connected: "bg-zinc-300",
        };

        return (
          <section className="rounded-lg border border-amber-200 bg-amber-50 p-5">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-[10px] font-semibold uppercase tracking-wider text-amber-700">Onboarding Progress</h3>
              <span className="text-xs font-semibold text-amber-700">{connected} of {total} platforms connected</span>
            </div>
            <div className="space-y-2">
              {platforms.map((p) => (
                <div key={p.id} className="flex items-center gap-3">
                  <span className={`h-2 w-2 shrink-0 rounded-full ${statusDot[p.connection_status || "not_connected"] || statusDot.not_connected}`} />
                  <span className="text-sm text-zinc-900">{PLATFORM_LABELS[p.platform_key] || p.platform_key}</span>
                  <span className="text-xs text-zinc-500">{(p.connection_status || "not_connected").replace(/_/g, " ")}</span>
                </div>
              ))}
            </div>
          </section>
        );
      })()}

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
                  {p.last_sync_at && <span className="ml-2 text-[10px] text-zinc-400">Synced: {new Date(p.last_sync_at).toLocaleDateString()}</span>}
                </div>
                <PlatformStatusDropdown platformId={p.id} currentStatus={p.connection_status || "not_connected"} />
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Active Tasks */}
      <section>
        <div className="mb-3 flex items-center justify-between">
          <h3 className="text-[10px] font-semibold uppercase tracking-wider text-zinc-500">Active Tasks ({activeTasks.length})</h3>
          <div className="flex items-center gap-3">
            <Link href={`/dashboard/queue?newTask=${client.id}`} className="rounded-lg bg-zinc-900 px-4 py-1.5 text-xs font-semibold text-white hover:bg-zinc-800 transition-colors">
              Create Task
            </Link>
            <BulkTaskForm clientId={client.id} />
            <BatchDraftButton
              clientId={client.id}
              eligibleCount={activeTasks.filter((t) => t.status === "NEW" && !t.ai_draft && t.service_key !== "weekly_summary").length}
            />
            <Link href="/dashboard/queue" className="text-xs font-medium text-zinc-500 hover:text-zinc-900">
              Open Queue →
            </Link>
          </div>
        </div>
        {activeTasks.length === 0 ? (
          <EmptyState message="No active tasks. Create a task or import data to get started." actionLabel="Create Task" actionHref={`/dashboard/queue?newTask=${client.id}`} />
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
                      <Link href={`/dashboard/queue?task=${t.id}`} className="text-sm font-medium text-zinc-900 hover:underline">{t.title}</Link>
                    </div>
                    <div className="flex items-center gap-3">
                      <TaskQuickActions
                        taskId={t.id}
                        status={t.status || "NEW"}
                        serviceKey={t.service_key}
                        hasAiDraft={!!t.ai_draft}
                      />
                      <span className="text-xs text-zinc-400">{SERVICE_LABELS[t.service_key || ""] || t.service_key || "—"}</span>
                    </div>
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

      {/* Completed Work */}
      <section>
        <CompletedWork tasks={completedWorkTasks} />
      </section>

      {/* Weekly Summary */}
      <section>
        <WeeklySummary
          createdThisWeek={createdThisWeek}
          completedThisWeek={completedThisWeek.length}
          openByStatus={openByStatus}
          completedTasks={completedTasksList}
          clientName={client.name}
          contactFirstName={(client.primary_contact_name || "").split(" ")[0]}
          weekStart={weekStart}
          weekEnd={weekEnd}
        />
      </section>

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
