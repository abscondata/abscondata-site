"use client";

import type { Database } from "@/lib/database.types";

type Client = Database["public"]["Tables"]["clients"]["Row"];
type Task = Database["public"]["Tables"]["tasks"]["Row"];
type Exception = Database["public"]["Tables"]["exceptions"]["Row"];
type WeeklyReport = Database["public"]["Tables"]["weekly_reports"]["Row"];

export function OwnerOverview({ clients, tasks, exceptions, reports }: { clients: Client[]; tasks: Task[]; exceptions: Exception[]; reports: WeeklyReport[] }) {
  const activeClients = clients.filter((c) => c.status?.toLowerCase() === "active").length;
  const highPriority = tasks.filter((t) => t.priority?.toLowerCase() === "high").length;

  return (
    <div className="space-y-6">
      <h2 className="text-lg font-semibold text-zinc-900">Overview</h2>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {[["Total Clients", clients.length], ["Active Clients", activeClients], ["Open Tasks", tasks.length], ["Open Exceptions", exceptions.length]].map(([label, value]) => (
          <div key={String(label)} className="rounded-lg border border-zinc-200 bg-white p-4">
            <p className="text-[10px] font-semibold uppercase tracking-wider text-zinc-500">{label}</p>
            <p className="mt-1 text-2xl font-semibold text-zinc-900">{value}</p>
          </div>
        ))}
      </div>
      {highPriority > 0 && (
        <div className="rounded-lg border border-red-200 bg-red-50 p-4">
          <p className="text-sm font-medium text-red-800">{highPriority} high-priority task{highPriority > 1 ? "s" : ""} need attention</p>
        </div>
      )}
      {exceptions.length > 0 && (
        <div>
          <h3 className="mb-2 text-sm font-semibold text-zinc-900">Open Exceptions</h3>
          <div className="space-y-2">
            {exceptions.slice(0, 5).map((ex) => (
              <div key={ex.id} className="rounded-lg border border-zinc-200 bg-white p-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-zinc-900">{ex.description ?? "No description"}</span>
                  <span className={`rounded-full border px-2 py-0.5 text-xs font-medium ${ex.severity?.toLowerCase() === "high" || ex.severity?.toLowerCase() === "critical" ? "border-red-200 bg-red-50 text-red-700" : "border-amber-200 bg-amber-50 text-amber-700"}`}>{ex.severity ?? "—"}</span>
                </div>
                <p className="mt-1 text-xs text-zinc-500">{ex.issue_type ?? "—"} · {ex.resolution_status ?? "—"}</p>
              </div>
            ))}
          </div>
        </div>
      )}
      {reports.length > 0 && (
        <div>
          <h3 className="mb-2 text-sm font-semibold text-zinc-900">Recent Weekly Reports</h3>
          <div className="space-y-2">
            {reports.slice(0, 3).map((r) => (
              <div key={r.id} className="rounded-lg border border-zinc-200 bg-white p-3">
                <p className="text-sm font-medium text-zinc-900">Week of {r.week_start ? new Date(r.week_start).toLocaleDateString() : "—"}</p>
                <p className="mt-1 text-xs text-zinc-500">{r.summary ?? "No summary"}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
