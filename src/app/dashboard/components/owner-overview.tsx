"use client";

import Link from "next/link";

interface FormattedEvent {
  id: string;
  taskId: number | null;
  taskTitle: string;
  clientName: string;
  eventType: string;
  notes: string | null;
  createdAt: string;
}

interface ClientHealth {
  id: number;
  name: string;
  openTasks: number;
  oldestTaskDays: number | null;
  platformErrors: string[];
}

function getGreeting(): string {
  // Eastern time approximation
  const now = new Date();
  const eastern = new Date(now.toLocaleString("en-US", { timeZone: "America/New_York" }));
  const hour = eastern.getHours();
  if (hour < 12) return "Good morning";
  if (hour < 17) return "Good afternoon";
  return "Good evening";
}

function formatEventType(eventType: string): string {
  return eventType
    .replace("status_change:", "")
    .replace(/→/g, " → ")
    .replace(/_/g, " ");
}

function timeAgo(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime();
  const minutes = Math.floor(diff / 60000);
  if (minutes < 1) return "just now";
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  return `${days}d ago`;
}

export function OwnerOverview({
  reviewCount,
  newCount,
  pendingOnboarding,
  recentEvents,
  clientHealth,
}: {
  reviewCount: number;
  newCount: number;
  pendingOnboarding: number;
  recentEvents: FormattedEvent[];
  clientHealth: ClientHealth[];
}) {
  return (
    <div className="space-y-8">
      {/* Greeting */}
      <h2 className="text-lg font-semibold text-zinc-900">{getGreeting()}</h2>

      {/* Action strip */}
      <div className="grid grid-cols-3 gap-3">
        <Link
          href="/dashboard/queue"
          className={`rounded-lg p-4 transition-colors ${reviewCount > 0 ? "bg-amber-50 hover:bg-amber-100" : "bg-zinc-50 hover:bg-zinc-100"}`}
        >
          <p className={`text-2xl font-semibold ${reviewCount > 0 ? "text-amber-700" : "text-zinc-900"}`}>{reviewCount}</p>
          <p className="mt-0.5 text-xs font-medium text-zinc-500">tasks to review</p>
        </Link>
        <Link
          href="/dashboard/queue"
          className="rounded-lg bg-zinc-50 p-4 transition-colors hover:bg-zinc-100"
        >
          <p className="text-2xl font-semibold text-zinc-900">{newCount}</p>
          <p className="mt-0.5 text-xs font-medium text-zinc-500">new tasks</p>
        </Link>
        <Link
          href="/dashboard/onboarding"
          className={`rounded-lg p-4 transition-colors ${pendingOnboarding > 0 ? "bg-amber-50 hover:bg-amber-100" : "bg-zinc-50 hover:bg-zinc-100"}`}
        >
          <p className={`text-2xl font-semibold ${pendingOnboarding > 0 ? "text-amber-700" : "text-zinc-900"}`}>{pendingOnboarding}</p>
          <p className="mt-0.5 text-xs font-medium text-zinc-500">pending onboarding</p>
        </Link>
      </div>

      {/* Quick actions */}
      <div className="flex flex-wrap gap-3">
        <Link href="/dashboard/clients/new" className="rounded-lg bg-zinc-900 px-5 py-2.5 text-xs font-semibold text-white hover:bg-zinc-800 transition-colors">
          Add Client
        </Link>
        <Link href="/dashboard/outreach" className="rounded-lg border border-zinc-300 bg-white px-5 py-2.5 text-xs font-semibold text-zinc-700 hover:bg-zinc-50 transition-colors">
          Pull Leads
        </Link>
      </div>

      {/* Recent activity */}
      <div>
        <h3 className="mb-3 text-[10px] font-semibold uppercase tracking-wider text-zinc-500">Recent Activity</h3>
        {recentEvents.length === 0 ? (
          <p className="py-8 text-center text-sm text-zinc-400">No recent activity.</p>
        ) : (
          <div className="space-y-1">
            {recentEvents.map((e) => (
              <div key={e.id} className="flex items-center justify-between rounded-lg px-3 py-2 hover:bg-zinc-50 transition-colors">
                <div className="flex items-center gap-3 min-w-0">
                  <span className="shrink-0 text-[10px] text-zinc-400 w-12">{timeAgo(e.createdAt)}</span>
                  <span className="shrink-0 text-xs font-medium text-zinc-700 w-28 truncate">{e.clientName}</span>
                  <span className="text-xs text-zinc-500 truncate">{formatEventType(e.eventType)}</span>
                </div>
                {e.taskId && (
                  <Link href={`/dashboard/queue?task=${e.taskId}`} className="shrink-0 text-xs text-zinc-400 hover:text-zinc-700 truncate max-w-48">
                    {e.taskTitle}
                  </Link>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Client health */}
      {clientHealth.length > 0 && (
        <div>
          <h3 className="mb-3 text-[10px] font-semibold uppercase tracking-wider text-zinc-500">Client Health</h3>
          <div className="overflow-hidden rounded-lg border border-zinc-200">
            <table className="w-full text-sm">
              <thead className="border-b border-zinc-200 bg-zinc-50">
                <tr>
                  {["Client", "Open Tasks", "Oldest Task", "Issues"].map((h) => (
                    <th key={h} className="px-4 py-2.5 text-left text-[10px] font-semibold uppercase tracking-wider text-zinc-500">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-100">
                {clientHealth.map((c) => (
                  <tr key={c.id} className={`bg-white ${(c.oldestTaskDays ?? 0) > 7 || c.platformErrors.length > 0 ? "bg-amber-50/50" : ""}`}>
                    <td className="px-4 py-2.5">
                      <Link href={`/dashboard/clients/${c.id}`} className="font-medium text-zinc-900 hover:underline">{c.name}</Link>
                    </td>
                    <td className="px-4 py-2.5 text-zinc-600">{c.openTasks}</td>
                    <td className="px-4 py-2.5">
                      {c.oldestTaskDays !== null ? (
                        <span className={`text-xs font-medium ${c.oldestTaskDays > 7 ? "text-amber-700" : c.oldestTaskDays > 3 ? "text-zinc-700" : "text-zinc-500"}`}>
                          {c.oldestTaskDays}d
                        </span>
                      ) : (
                        <span className="text-xs text-zinc-400">—</span>
                      )}
                    </td>
                    <td className="px-4 py-2.5">
                      {c.platformErrors.length > 0 ? (
                        <span className="rounded-full border border-red-200 bg-red-50 px-2 py-0.5 text-xs font-medium text-red-700">
                          {c.platformErrors.length} platform {c.platformErrors.length === 1 ? "error" : "errors"}
                        </span>
                      ) : (
                        <span className="text-xs text-zinc-400">—</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
