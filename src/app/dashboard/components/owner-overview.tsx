"use client";

import Link from "next/link";
import type { Database } from "@/lib/database.types";

type Client = Database["public"]["Tables"]["clients"]["Row"];
type Task = Database["public"]["Tables"]["tasks"]["Row"];

const SERVICE_LABELS: Record<string, string> = {
  invoice_ops: "Invoice Ops",
  payment_followup: "Payment Follow-Up",
  review_requests: "Review Requests",
  weekly_summary: "Weekly Summary",
  lead_intake: "Lead & Intake",
};

const STATUS_COLORS: Record<string, string> = {
  NEW: "border-blue-200 bg-blue-50 text-blue-700",
  READY_FOR_REVIEW: "border-amber-200 bg-amber-50 text-amber-700",
  WAITING_ON_MISSING_DATA: "border-orange-200 bg-orange-50 text-orange-700",
  APPROVED: "border-emerald-200 bg-emerald-50 text-emerald-700",
  SENT: "border-violet-200 bg-violet-50 text-violet-700",
};

export function OwnerOverview({
  clients,
  tasks,
  pendingOnboarding,
  clientMap,
}: {
  clients: Client[];
  tasks: Task[];
  pendingOnboarding: number;
  clientMap: Record<number, string>;
}) {
  const activeClients = clients.filter((c) => c.status?.toLowerCase() === "active").length;
  const needsReview = tasks.filter((t) => t.status === "READY_FOR_REVIEW").length;
  const newTasks = tasks.filter((t) => t.status === "NEW").length;
  const recentTasks = tasks.slice(0, 8);

  return (
    <div className="space-y-8">
      <h2 className="text-lg font-semibold text-zinc-900">Overview</h2>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-5">
        {[
          { label: "Active Clients", value: activeClients },
          { label: "Needs Review", value: needsReview, highlight: needsReview > 0 },
          { label: "New Tasks", value: newTasks },
          { label: "Open Tasks", value: tasks.length },
          { label: "Pending Onboarding", value: pendingOnboarding },
        ].map((s) => (
          <div key={s.label} className={`rounded-lg border p-4 ${s.highlight ? "border-amber-200 bg-amber-50" : "border-zinc-200 bg-white"}`}>
            <p className="text-[10px] font-semibold uppercase tracking-wider text-zinc-500">{s.label}</p>
            <p className={`mt-1 text-2xl font-semibold ${s.highlight ? "text-amber-700" : "text-zinc-900"}`}>{s.value}</p>
          </div>
        ))}
      </div>

      {/* Quick Links */}
      <div className="flex flex-wrap gap-3">
        <Link href="/dashboard/queue" className="rounded-lg bg-zinc-900 px-5 py-2.5 text-xs font-semibold text-white hover:bg-zinc-800 transition-colors">
          Go to Queue
        </Link>
        <Link href="/dashboard/onboarding" className="rounded-lg border border-zinc-300 bg-white px-5 py-2.5 text-xs font-semibold text-zinc-700 hover:bg-zinc-50 transition-colors">
          Onboarding ({pendingOnboarding})
        </Link>
        <Link href="/dashboard/outreach" className="rounded-lg border border-zinc-300 bg-white px-5 py-2.5 text-xs font-semibold text-zinc-700 hover:bg-zinc-50 transition-colors">
          Outreach
        </Link>
        <Link href="/dashboard/clients/new" className="rounded-lg border border-zinc-300 bg-white px-5 py-2.5 text-xs font-semibold text-zinc-700 hover:bg-zinc-50 transition-colors">
          Add Client
        </Link>
      </div>

      {/* Recent Tasks */}
      {recentTasks.length > 0 && (
        <div>
          <div className="mb-3 flex items-center justify-between">
            <h3 className="text-[10px] font-semibold uppercase tracking-wider text-zinc-500">Recent Tasks</h3>
            <Link href="/dashboard/queue" className="text-xs font-medium text-zinc-500 hover:text-zinc-900">
              View All →
            </Link>
          </div>
          <div className="space-y-2">
            {recentTasks.map((t) => (
              <div key={t.id} className="flex items-center justify-between rounded-lg border border-zinc-200 bg-white px-4 py-3">
                <div className="flex items-center gap-3 min-w-0">
                  <span className={`shrink-0 rounded-full border px-2 py-0.5 text-[10px] font-semibold ${STATUS_COLORS[t.status || "NEW"] || STATUS_COLORS.NEW}`}>
                    {(t.status || "NEW").replace(/_/g, " ")}
                  </span>
                  <span className="truncate text-sm font-medium text-zinc-900">{t.title || "Untitled"}</span>
                </div>
                <div className="flex shrink-0 items-center gap-3 text-xs">
                  <span className="font-medium text-zinc-700">{t.client_id ? clientMap[t.client_id] || "" : ""}</span>
                  <span className="text-zinc-400">{SERVICE_LABELS[t.service_key || ""] || ""}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {recentTasks.length === 0 && (
        <div className="rounded-lg border border-zinc-200 bg-white px-6 py-12 text-center">
          <p className="text-sm text-zinc-500">No open tasks. Import data or onboard a client to get started.</p>
        </div>
      )}
    </div>
  );
}
