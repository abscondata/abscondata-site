"use client";

import { useState } from "react";
import { SectionLabel, EmptyState } from "../../components/ui";

const SERVICE_LABELS: Record<string, string> = {
  invoice_ops: "Invoice Operations",
  payment_followup: "Payment Follow-Up",
  review_requests: "Review Requests",
  weekly_summary: "Weekly Summary",
  lead_intake: "Lead & Intake",
};

interface CompletedTask {
  id: number;
  title: string;
  serviceKey: string | null;
  recipientName: string | null;
  recipientEmail: string | null;
  sentAt: string | null;
}

type Range = "week" | "lastweek" | "all";

export function CompletedWork({ tasks }: { tasks: CompletedTask[] }) {
  const [range, setRange] = useState<Range>("week");

  const now = new Date();
  const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
  const twoWeeksAgo = new Date(now.getTime() - 14 * 24 * 60 * 60 * 1000);

  const filtered = tasks.filter((t) => {
    if (range === "all") return true;
    const d = t.sentAt ? new Date(t.sentAt) : null;
    if (!d) return false;
    if (range === "week") return d >= weekAgo;
    if (range === "lastweek") return d >= twoWeeksAgo && d < weekAgo;
    return true;
  });

  const thisWeekCount = tasks.filter((t) => t.sentAt && new Date(t.sentAt) >= weekAgo).length;

  return (
    <div>
      <div className="mb-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <SectionLabel>Completed Work</SectionLabel>
          <span className="text-xs text-zinc-500">{thisWeekCount} completed this week</span>
        </div>
        <div className="flex border-b border-zinc-200">
          {([
            { key: "week", label: "This Week" },
            { key: "lastweek", label: "Last Week" },
            { key: "all", label: "All Time" },
          ] as const).map((tab) => (
            <button
              key={tab.key}
              onClick={() => setRange(tab.key)}
              className={`relative px-3 py-1.5 text-xs font-medium transition-colors ${
                range === tab.key ? "text-zinc-800" : "text-zinc-400 hover:text-zinc-600"
              }`}
            >
              {tab.label}
              {range === tab.key && <span className="absolute bottom-0 left-3 right-3 h-[2px] bg-zinc-800" />}
            </button>
          ))}
        </div>
      </div>

      {filtered.length === 0 ? (
        <EmptyState message={range === "week" ? "No completed work this week." : range === "lastweek" ? "No completed work last week." : "No completed work yet."} />
      ) : (
        <div className="overflow-hidden rounded-lg border border-zinc-200">
          <table className="w-full text-sm">
            <thead className="border-b border-zinc-200 bg-zinc-50">
              <tr>
                {["Date", "Task", "Service", "Recipient", "Email"].map((h) => (
                  <th key={h} className="px-4 py-2.5 text-left text-[10px] font-medium uppercase tracking-wider text-zinc-500">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100">
              {filtered.map((t) => (
                <tr key={t.id} className="bg-white">
                  <td className="px-4 py-2.5 text-xs text-zinc-600">
                    {t.sentAt ? new Date(t.sentAt).toLocaleDateString("en-US", { month: "short", day: "numeric" }) : ""}
                  </td>
                  <td className="px-4 py-2.5 font-medium text-zinc-900 text-xs">{t.title}</td>
                  <td className="px-4 py-2.5 text-xs text-zinc-500">{SERVICE_LABELS[t.serviceKey || ""] || t.serviceKey || ""}</td>
                  <td className="px-4 py-2.5 text-xs text-zinc-700">{t.recipientName || ""}</td>
                  <td className="px-4 py-2.5 text-xs text-zinc-500">{t.recipientEmail || ""}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
