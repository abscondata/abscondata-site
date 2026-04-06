"use client";

import { useState } from "react";

const FRIENDLY_SERVICE: Record<string, string> = {
  invoice_ops: "Invoice Operations",
  payment_followup: "Payment Follow-Up",
  review_requests: "Review Requests",
  weekly_summary: "Weekly Summary",
  lead_intake: "Lead & Intake Admin",
};

interface SummaryProps {
  clientName: string;
  niche: string | null;
  services: string[];
  platformsConnected: number;
  platformsTotal: number;
  weekLabel: string;
  completedCount: number;
  completedTasks: Array<{ title: string; date: string }>;
}

export function SummaryCard({
  clientName,
  niche,
  services,
  platformsConnected,
  platformsTotal,
  weekLabel,
  completedCount,
  completedTasks,
}: SummaryProps) {
  const [visible, setVisible] = useState(false);

  return (
    <>
      <button
        onClick={() => setVisible(!visible)}
        className="rounded-lg border border-zinc-300 bg-white px-4 py-1.5 text-xs font-semibold text-zinc-700 hover:bg-zinc-50 transition-colors"
      >
        {visible ? "Hide Summary" : "Client Summary"}
      </button>

      {visible && (
        <div className="mt-4 print:mt-0" id="client-summary">
          <div className="rounded-lg border border-zinc-200 bg-white p-6 print:border-0 print:p-0 print:shadow-none">
            {/* Print button */}
            <div className="mb-6 flex items-center justify-between print:hidden">
              <span className="text-xs font-medium uppercase tracking-wider text-zinc-400">Client Summary</span>
              <button
                onClick={() => window.print()}
                className="rounded-lg border border-zinc-300 bg-white px-4 py-1.5 text-xs font-semibold text-zinc-700 hover:bg-zinc-50 transition-colors"
              >
                Print Summary
              </button>
            </div>

            {/* Header */}
            <div className="mb-6 print:mb-4">
              <h3 className="text-lg font-semibold text-zinc-900">{clientName}</h3>
              {niche && <p className="mt-0.5 text-sm text-zinc-500">{niche}</p>}
              <p className="mt-1 text-xs text-zinc-400">Week of {weekLabel}</p>
            </div>

            {/* Services */}
            <div className="mb-6 print:mb-4">
              <p className="mb-2 text-[10px] font-medium uppercase tracking-wider text-zinc-500">Services</p>
              <div className="flex flex-wrap gap-2">
                {services.map((s) => (
                  <span key={s} className="rounded-full bg-zinc-100 px-3 py-1 text-xs font-medium text-zinc-700">
                    {FRIENDLY_SERVICE[s] || s}
                  </span>
                ))}
              </div>
            </div>

            {/* Systems */}
            <div className="mb-6 print:mb-4">
              <p className="mb-1 text-[10px] font-medium uppercase tracking-wider text-zinc-500">Systems Connected</p>
              <p className="text-sm text-zinc-900">{platformsConnected} of {platformsTotal} platforms connected</p>
            </div>

            {/* Completed work */}
            <div>
              <p className="mb-2 text-[10px] font-medium uppercase tracking-wider text-zinc-500">
                Completed This Week ({completedCount})
              </p>
              {completedTasks.length === 0 ? (
                <p className="text-sm text-zinc-400">No tasks completed this week.</p>
              ) : (
                <div className="space-y-1.5">
                  {completedTasks.map((t, i) => (
                    <div key={i} className="flex items-center justify-between rounded bg-zinc-50 px-3 py-2 print:bg-white print:border-b print:border-zinc-100 print:rounded-none print:px-0">
                      <span className="text-xs text-zinc-900">{t.title}</span>
                      <span className="text-[10px] text-zinc-400">{t.date}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Footer for print */}
            <div className="mt-8 hidden print:block border-t border-zinc-200 pt-4">
              <p className="text-[10px] text-zinc-400">Prepared by Abscondata. All actions documented.</p>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
