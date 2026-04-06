"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import Link from "next/link";
import { PageHeader, EmptyState } from "../components/ui";

interface EventRow {
  id: string;
  task_id: number | null;
  event_type: string;
  actor_id: string | null;
  notes: string | null;
  created_at: string;
  tasks: {
    id: number;
    title: string;
    client_id: number;
    clients: { id: number; name: string } | null;
  } | null;
}

function formatEventType(eventType: string): string {
  if (eventType === "task_created") return "Task created";
  return eventType
    .replace("status_change:", "")
    .replace(/→/g, " → ")
    .replace(/_/g, " ");
}

function formatTimestamp(dateStr: string): string {
  const d = new Date(dateStr);
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric" }) +
    " " +
    d.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" });
}

type DateRange = "week" | "lastweek" | "30days" | "all";

export function ActivityLog({
  clients,
  profileMap,
}: {
  clients: { id: number; name: string }[];
  profileMap: Record<string, { email: string; role: string }>;
}) {
  const [events, setEvents] = useState<EventRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [clientFilter, setClientFilter] = useState("");
  const [dateRange, setDateRange] = useState<DateRange>("week");
  const PAGE_SIZE = 25;

  function getDateCutoff(range: DateRange): string | null {
    const now = new Date();
    if (range === "week") {
      return new Date(now.getTime() - 7 * 24 * 3600000).toISOString();
    }
    if (range === "lastweek") {
      return new Date(now.getTime() - 14 * 24 * 3600000).toISOString();
    }
    if (range === "30days") {
      return new Date(now.getTime() - 30 * 24 * 3600000).toISOString();
    }
    return null;
  }

  async function fetchEvents(offset: number, append: boolean) {
    const supabase = createClient();
    let query = supabase
      .from("task_events")
      .select("id, task_id, event_type, actor_id, notes, created_at, tasks(id, title, client_id, clients(id, name))")
      .order("created_at", { ascending: false })
      .range(offset, offset + PAGE_SIZE - 1);

    const cutoff = getDateCutoff(dateRange);
    if (cutoff) {
      query = query.gte("created_at", cutoff);
    }

    const { data } = await query;
    const rows = (data ?? []) as unknown as EventRow[];

    // Client-side client filter (since task_events doesn't have client_id directly)
    const filtered = clientFilter
      ? rows.filter((e) => e.tasks?.client_id === Number(clientFilter))
      : rows;

    if (append) {
      setEvents((prev) => [...prev, ...filtered]);
    } else {
      setEvents(filtered);
    }
    setHasMore(rows.length === PAGE_SIZE);
  }

  useEffect(() => {
    setLoading(true);
    setEvents([]);
    fetchEvents(0, false).finally(() => setLoading(false));
  }, [clientFilter, dateRange]);

  async function handleLoadMore() {
    setLoadingMore(true);
    await fetchEvents(events.length, true);
    setLoadingMore(false);
  }

  function actorLabel(actorId: string | null): string {
    if (!actorId) return "System";
    const p = profileMap[actorId];
    if (!p) return "Unknown";
    const name = p.email.split("@")[0];
    return `${name} (${p.role})`;
  }

  const inputClasses = "rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-900 focus:border-zinc-400 focus:outline-none";

  return (
    <div className="space-y-6">
      <PageHeader>Activity Log</PageHeader>

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-4">
        <select
          value={clientFilter}
          onChange={(e) => setClientFilter(e.target.value)}
          className={inputClasses}
        >
          <option value="">All clients</option>
          {clients.map((c) => (
            <option key={c.id} value={c.id}>{c.name}</option>
          ))}
        </select>

        <div className="flex border-b border-zinc-200">
          {([
            { key: "week", label: "This Week" },
            { key: "lastweek", label: "Last 2 Weeks" },
            { key: "30days", label: "Last 30 Days" },
            { key: "all", label: "All Time" },
          ] as const).map((tab) => (
            <button
              key={tab.key}
              onClick={() => setDateRange(tab.key)}
              className={`relative px-3 py-2 text-xs font-medium transition-colors ${
                dateRange === tab.key ? "text-zinc-800" : "text-zinc-400 hover:text-zinc-600"
              }`}
            >
              {tab.label}
              {dateRange === tab.key && <span className="absolute bottom-0 left-3 right-3 h-[2px] bg-zinc-800" />}
            </button>
          ))}
        </div>
      </div>

      {/* Events */}
      {loading ? (
        <div className="space-y-2 animate-pulse">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="flex items-center gap-4 rounded-lg border border-zinc-200 bg-white px-4 py-3">
              <div className="h-3 w-28 rounded bg-zinc-200" />
              <div className="h-3 w-20 rounded bg-zinc-200" />
              <div className="h-3 w-32 rounded bg-zinc-200 flex-1" />
              <div className="h-3 w-40 rounded bg-zinc-200" />
            </div>
          ))}
        </div>
      ) : events.length === 0 ? (
        <EmptyState message="No activity found for the selected filters." />
      ) : (
        <div className="overflow-hidden rounded-lg border border-zinc-200">
          <table className="w-full text-sm">
            <thead className="border-b border-zinc-200 bg-zinc-50">
              <tr>
                {["Time", "Client", "Event", "Task", "Actor"].map((h) => (
                  <th key={h} className="px-4 py-2.5 text-left text-[10px] font-semibold uppercase tracking-wider text-zinc-500">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100">
              {events.map((e) => {
                const task = e.tasks;
                const clientName = task?.clients?.name ?? "—";
                return (
                  <tr key={e.id} className="bg-white">
                    <td className="px-4 py-2.5 text-xs text-zinc-500 whitespace-nowrap">{formatTimestamp(e.created_at)}</td>
                    <td className="px-4 py-2.5 text-xs font-medium text-zinc-700">
                      {task?.client_id ? (
                        <Link href={`/dashboard/clients/${task.client_id}`} className="hover:underline">{clientName}</Link>
                      ) : clientName}
                    </td>
                    <td className="px-4 py-2.5 text-xs text-zinc-600">{formatEventType(e.event_type)}</td>
                    <td className="px-4 py-2.5 text-xs text-zinc-900">
                      {task ? (
                        <Link href={`/dashboard/queue?task=${task.id}`} className="hover:underline">{task.title}</Link>
                      ) : "—"}
                    </td>
                    <td className="px-4 py-2.5 text-xs text-zinc-500">{actorLabel(e.actor_id)}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* Load more */}
      {!loading && hasMore && events.length > 0 && (
        <div className="text-center">
          <button
            onClick={handleLoadMore}
            disabled={loadingMore}
            className="rounded-lg border border-zinc-300 bg-white px-6 py-2.5 text-xs font-semibold text-zinc-700 hover:bg-zinc-50 disabled:opacity-50 transition-colors"
          >
            {loadingMore ? "Loading..." : "Load More"}
          </button>
        </div>
      )}
    </div>
  );
}
