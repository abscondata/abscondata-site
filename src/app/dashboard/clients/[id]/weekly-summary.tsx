"use client";

import { useState } from "react";
import { SectionLabel, StatusBadge } from "../../components/ui";
import { useToast } from "../../components/toast";

const SERVICE_REPORT_LABELS: Record<string, string> = {
  invoice_ops: "Invoicing",
  payment_followup: "Payment Follow-up",
  review_requests: "Review Requests",
  lead_intake: "Lead Intake",
  weekly_summary: "Weekly Summary",
};

interface CompletedTask {
  id: number;
  title: string;
  completedAt: string;
  serviceKey: string | null;
}

interface WeeklySummaryProps {
  createdThisWeek: number;
  completedThisWeek: number;
  openByStatus: Record<string, number>;
  completedTasks: CompletedTask[];
  clientName: string;
  contactFirstName: string;
  weekStart: string;
  weekEnd: string;
}

export function WeeklySummary({
  createdThisWeek,
  completedThisWeek,
  openByStatus,
  completedTasks,
  clientName,
  contactFirstName,
  weekStart,
  weekEnd,
}: WeeklySummaryProps) {
  const totalOpen = Object.values(openByStatus).reduce((a, b) => a + b, 0);
  const { toast } = useToast();
  const [copied, setCopied] = useState(false);

  // Group completed by service
  const byService: Record<string, CompletedTask[]> = {};
  for (const t of completedTasks) {
    const key = t.serviceKey || "other";
    if (!byService[key]) byService[key] = [];
    byService[key].push(t);
  }

  // Build copy-paste report
  const firstName = contactFirstName || "there";
  const subject = `Weekly Update — ${clientName} — ${weekStart} to ${weekEnd}`;

  const serviceCounts = Object.entries(byService)
    .map(([key, tasks]) => {
      const label = SERVICE_REPORT_LABELS[key] || key.replace(/_/g, " ");
      const verb = key === "lead_intake" ? "processed" : "sent";
      return `${label}: ${tasks.length} ${verb}`;
    })
    .join("\n");

  const details = completedTasks
    .map((t) => `- ${t.title} (${new Date(t.completedAt).toLocaleDateString("en-US", { month: "short", day: "numeric" })})`)
    .join("\n");

  const reportBody = `Hi ${firstName},

Here is your weekly operations summary.

Completed This Week:

${serviceCounts || "No tasks completed this week."}

${details ? `Details:\n${details}` : ""}

Currently In Progress: ${totalOpen} tasks

Best,
Robin
Abscondata`;

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(`Subject: ${subject}\n\n${reportBody}`);
      setCopied(true);
      toast("Report copied to clipboard", "success");
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast("Failed to copy", "error");
    }
  }

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

      {/* Client Report — copy-paste block */}
      <div className="border-t border-zinc-200 pt-4">
        <div className="mb-3 flex items-center justify-between">
          <SectionLabel>Client Report</SectionLabel>
          <button
            onClick={handleCopy}
            className="rounded-lg border border-zinc-300 bg-white px-4 py-1.5 text-xs font-semibold text-zinc-700 hover:bg-zinc-50 transition-colors"
          >
            {copied ? "Copied!" : "Copy to Clipboard"}
          </button>
        </div>
        <div className="rounded-lg border border-zinc-200 bg-zinc-50 p-4">
          <p className="mb-3 select-all text-xs font-semibold text-zinc-700">Subject: {subject}</p>
          <pre className="whitespace-pre-wrap font-sans text-sm text-zinc-700 leading-relaxed select-all">{reportBody}</pre>
        </div>
      </div>
    </div>
  );
}
