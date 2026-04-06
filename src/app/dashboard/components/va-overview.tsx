"use client";

import Link from "next/link";
import { SectionLabel, EmptyState } from "./ui";

interface VAEvent {
  id: string;
  taskTitle: string;
  clientName: string;
  eventType: string;
  createdAt: string;
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

function formatEventType(eventType: string): string {
  return eventType
    .replace("status_change:", "")
    .replace(/→/g, " → ")
    .replace(/_/g, " ");
}

export function VAOverview({
  reviewCount,
  waitingCount,
  recentEvents,
}: {
  reviewCount: number;
  waitingCount: number;
  recentEvents: VAEvent[];
}) {
  return (
    <div className="space-y-8">
      <h2 className="text-xl font-semibold text-zinc-800">Your Queue</h2>

      {/* Action strip */}
      <div className="grid grid-cols-2 gap-3">
        <Link
          href="/dashboard/queue?filter=READY_FOR_REVIEW"
          className={`rounded-lg border-l-[3px] bg-white p-5 transition-colors hover:bg-zinc-50 ${
            reviewCount > 0 ? "border-l-amber-400" : "border-l-zinc-200"
          }`}
        >
          <p className={`text-3xl font-semibold ${reviewCount > 0 ? "text-amber-700" : "text-zinc-900"}`}>{reviewCount}</p>
          <p className="mt-1 text-xs font-medium text-zinc-500">tasks to review</p>
        </Link>
        <Link
          href="/dashboard/queue?filter=WAITING_ON_MISSING_DATA"
          className="rounded-lg border-l-[3px] border-l-zinc-200 bg-white p-5 transition-colors hover:bg-zinc-50"
        >
          <p className="text-3xl font-semibold text-zinc-900">{waitingCount}</p>
          <p className="mt-1 text-xs font-medium text-zinc-500">waiting on info</p>
        </Link>
      </div>

      {/* Recent activity */}
      <div>
        <SectionLabel>Your Recent Activity</SectionLabel>
        {recentEvents.length === 0 ? (
          <div className="mt-3">
            <EmptyState message="No recent activity. Tasks will appear here as you work." actionLabel="Go to Queue" actionHref="/dashboard/queue" />
          </div>
        ) : (
          <div className="mt-3 overflow-hidden rounded-lg border border-zinc-200">
            {recentEvents.map((e, i) => (
              <div key={e.id} className={`flex items-center justify-between px-4 py-2.5 ${i % 2 === 0 ? "bg-white" : "bg-zinc-50"}`}>
                <div className="flex items-center gap-3 min-w-0">
                  <span className="shrink-0 text-[10px] text-zinc-400 w-14">{timeAgo(e.createdAt)}</span>
                  <span className="shrink-0 text-xs font-medium text-zinc-700 w-28 truncate">{e.clientName}</span>
                  <span className="text-xs text-zinc-500 truncate">{formatEventType(e.eventType)}</span>
                </div>
                <span className="shrink-0 text-xs text-zinc-400 truncate max-w-48">{e.taskTitle}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
