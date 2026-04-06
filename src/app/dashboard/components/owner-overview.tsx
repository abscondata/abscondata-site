"use client";

import Link from "next/link";
import { SectionLabel, EmptyState } from "./ui";

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

function truncate(s: string, len: number): string {
  return s.length > len ? s.slice(0, len) + "..." : s;
}

export function OwnerOverview({
  reviewCount,
  newCount,
  pendingOnboarding,
  overdueCount = 0,
  recentEvents,
  clientHealth,
}: {
  reviewCount: number;
  newCount: number;
  pendingOnboarding: number;
  overdueCount?: number;
  recentEvents: FormattedEvent[];
  clientHealth: ClientHealth[];
}) {
  const capped = recentEvents.slice(0, 8);

  return (
    <div className="space-y-8">
      <h2 className="text-xl font-semibold text-zinc-800">{getGreeting()}</h2>

      {/* Action strip */}
      <div className={`grid gap-3 ${overdueCount > 0 ? "grid-cols-4" : "grid-cols-3"}`}>
        {[
          { count: reviewCount, label: "tasks to review", href: "/dashboard/queue?filter=READY_FOR_REVIEW", urgent: reviewCount > 0, danger: false },
          { count: newCount, label: "new tasks", href: "/dashboard/queue?filter=NEW", urgent: false, danger: false },
          { count: pendingOnboarding, label: "pending onboarding", href: "/dashboard/onboarding", urgent: pendingOnboarding > 0, danger: false },
          ...(overdueCount > 0 ? [{ count: overdueCount, label: "overdue tasks", href: "/dashboard/queue?filter=OVERDUE", urgent: true, danger: true }] : []),
        ].map((item) => (
          <Link
            key={item.label}
            href={item.href}
            className={`rounded-lg border-l-[3px] bg-white p-4 transition-colors hover:bg-zinc-50 ${
              item.danger ? "border-l-red-500" : item.urgent ? "border-l-amber-400" : "border-l-zinc-200"
            }`}
          >
            <p className={`text-2xl font-semibold ${item.danger ? "text-red-700" : item.urgent ? "text-amber-700" : "text-zinc-900"}`}>{item.count}</p>
            <p className="mt-0.5 text-xs font-medium text-zinc-500">{item.label}</p>
          </Link>
        ))}
      </div>

      {/* Quick actions */}
      <div>
        <Link href="/dashboard/clients/new" className="rounded-lg bg-zinc-900 px-5 py-2.5 text-xs font-semibold text-white hover:bg-zinc-800 transition-colors">
          Add Client
        </Link>
      </div>

      {/* Recent activity */}
      <div>
        <div className="mb-3 flex items-center justify-between">
          <SectionLabel>Recent Activity</SectionLabel>
          <Link href="/dashboard/queue" className="text-xs font-medium text-zinc-400 hover:text-zinc-700 transition-colors">
            View Queue →
          </Link>
        </div>
        {capped.length === 0 ? (
          <EmptyState message="No recent activity. Tasks will appear here as you work." actionLabel="Go to Queue" actionHref="/dashboard/queue" />
        ) : (
          <div className="overflow-hidden rounded-lg border border-zinc-200">
            {capped.map((e, i) => (
              <div key={e.id} className={`flex items-center justify-between px-4 py-2.5 ${i % 2 === 0 ? "bg-white" : "bg-zinc-50"}`}>
                <div className="flex items-center gap-3 min-w-0">
                  <span className="shrink-0 text-[10px] text-zinc-400 w-14">{timeAgo(e.createdAt)}</span>
                  <span className="shrink-0 text-xs font-medium text-zinc-700 w-28 truncate">{e.clientName}</span>
                  <span className="text-xs text-zinc-500 truncate">{formatEventType(e.eventType)}</span>
                </div>
                {e.taskId && (
                  <Link href={`/dashboard/queue?task=${e.taskId}`} className="shrink-0 text-xs text-zinc-400 hover:text-zinc-700 truncate max-w-48 transition-colors">
                    {truncate(e.taskTitle, 50)}
                  </Link>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Client health */}
      <div>
        <SectionLabel>Client Health</SectionLabel>
        {clientHealth.length === 0 ? (
          <div className="mt-3">
            <EmptyState message="No active clients. Your client health dashboard will populate as you onboard clients." actionLabel="Add Client" actionHref="/dashboard/clients/new" />
          </div>
        ) : (
          <div className="mt-3 overflow-hidden rounded-lg border border-zinc-200">
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
                  <tr key={c.id} className={`${(c.oldestTaskDays ?? 0) > 7 || c.platformErrors.length > 0 ? "bg-amber-50/40" : "bg-white"}`}>
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
                        <span className="text-xs text-zinc-400">none</span>
                      )}
                    </td>
                    <td className="px-4 py-2.5">
                      {c.platformErrors.length > 0 ? (
                        <span className="rounded-full bg-red-50 px-2 py-0.5 text-xs font-medium text-red-700">
                          {c.platformErrors.length} platform {c.platformErrors.length === 1 ? "error" : "errors"}
                        </span>
                      ) : (
                        <span className="text-xs text-zinc-400">none</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
