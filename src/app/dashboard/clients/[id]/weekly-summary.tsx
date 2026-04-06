"use client";

import { SectionLabel, StatusBadge } from "../../components/ui";

interface WeeklySummaryProps {
  createdThisWeek: number;
  completedThisWeek: number;
  openByStatus: Record<string, number>;
  completedTasks: Array<{ id: number; title: string; completedAt: string }>;
  clientName: string;
  weekStart: string;
  weekEnd: string;
}

export function WeeklySummary({
  createdThisWeek,
  completedThisWeek,
  openByStatus,
  completedTasks,
  clientName,
  weekStart,
  weekEnd,
}: WeeklySummaryProps) {
  const totalOpen = Object.values(openByStatus).reduce((a, b) => a + b, 0);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <SectionLabel>Weekly Summary</SectionLabel>
        <span className="text-xs text-zinc-400">{weekStart} to {weekEnd}</span>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-3 gap-3">
        <div className="rounded-lg bg-zinc-50 p-3">
          <p className="text-[10px] font-medium uppercase tracking-wider text-zinc-500">Created</p>
          <p className="mt-0.5 text-xl font-semibold text-zinc-900">{createdThisWeek}</p>
        </div>
        <div className="rounded-lg bg-zinc-50 p-3">
          <p className="text-[10px] font-medium uppercase tracking-wider text-zinc-500">Completed</p>
          <p className="mt-0.5 text-xl font-semibold text-emerald-700">{completedThisWeek}</p>
        </div>
        <div className="rounded-lg bg-zinc-50 p-3">
          <p className="text-[10px] font-medium uppercase tracking-wider text-zinc-500">Still Open</p>
          <p className="mt-0.5 text-xl font-semibold text-zinc-900">{totalOpen}</p>
        </div>
      </div>

      {/* Open breakdown */}
      {totalOpen > 0 && (
        <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-zinc-500">
          {Object.entries(openByStatus).map(([s, count]) => (
            <span key={s}>{s.replace(/_/g, " ")}: <span className="font-semibold text-zinc-700">{count}</span></span>
          ))}
        </div>
      )}

      {/* Completed tasks */}
      {completedTasks.length > 0 && (
        <div>
          <p className="mb-2 text-[10px] font-medium uppercase tracking-wider text-zinc-500">Completed This Week</p>
          <div className="space-y-1">
            {completedTasks.map((t) => (
              <div key={t.id} className="flex items-center justify-between rounded-lg bg-zinc-50 px-3 py-2">
                <div className="flex items-center gap-2">
                  <StatusBadge status="SENT" />
                  <span className="text-xs text-zinc-900">{t.title}</span>
                </div>
                <span className="text-[10px] text-zinc-400">{new Date(t.completedAt).toLocaleDateString()}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {createdThisWeek === 0 && completedThisWeek === 0 && (
        <p className="py-4 text-center text-sm text-zinc-400">No activity this week for {clientName}.</p>
      )}
    </div>
  );
}
