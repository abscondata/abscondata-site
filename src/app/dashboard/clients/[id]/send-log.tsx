"use client";

import { useState } from "react";
import { SectionLabel } from "../../components/ui";

const SERVICE_LABELS: Record<string, string> = {
  invoice_ops: "Invoice Ops",
  payment_followup: "Payment Follow-Up",
  review_requests: "Review Requests",
  weekly_summary: "Weekly Summary",
  lead_intake: "Lead & Intake",
};

interface SendLogEntry {
  id: number;
  service_key: string;
  recipient_name: string | null;
  recipient_email: string | null;
  sent_content: string | null;
  sent_at: string;
}

export function SendLog({ entries }: { entries: SendLogEntry[] }) {
  const [expandedId, setExpandedId] = useState<number | null>(null);

  if (entries.length === 0) return null;

  return (
    <div>
      <SectionLabel>Send Log</SectionLabel>
      <div className="mt-3 overflow-hidden rounded-lg border border-zinc-200">
        <table className="w-full text-sm">
          <thead className="border-b border-zinc-200 bg-zinc-50">
            <tr>
              {["Date", "Recipient", "Service", "Content"].map((h) => (
                <th key={h} className="px-4 py-2.5 text-left text-[10px] font-medium uppercase tracking-wider text-zinc-500">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-100">
            {entries.map((e) => {
              const isExpanded = expandedId === e.id;
              const preview = e.sent_content
                ? e.sent_content.length > 100 ? e.sent_content.slice(0, 100) + "..." : e.sent_content
                : "—";
              return (
                <tr key={e.id} className="bg-white">
                  <td className="px-4 py-2.5 text-xs text-zinc-500 whitespace-nowrap">
                    {new Date(e.sent_at).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                  </td>
                  <td className="px-4 py-2.5">
                    <div className="text-xs font-medium text-zinc-900">{e.recipient_name || "—"}</div>
                    {e.recipient_email && <div className="text-[10px] text-zinc-500">{e.recipient_email}</div>}
                  </td>
                  <td className="px-4 py-2.5 text-xs text-zinc-600">{SERVICE_LABELS[e.service_key] || e.service_key}</td>
                  <td className="px-4 py-2.5">
                    {isExpanded ? (
                      <div>
                        <pre className="whitespace-pre-wrap text-xs text-zinc-700 font-sans leading-relaxed">{e.sent_content || "—"}</pre>
                        <button onClick={() => setExpandedId(null)} className="mt-1 text-[10px] text-zinc-400 hover:text-zinc-600">Collapse</button>
                      </div>
                    ) : (
                      <button onClick={() => setExpandedId(e.id)} className="text-xs text-zinc-600 hover:text-zinc-900 text-left">
                        {preview}
                      </button>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
