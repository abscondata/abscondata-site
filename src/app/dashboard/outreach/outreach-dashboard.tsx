"use client";

import { useState } from "react";
import { markBatchUploaded } from "./actions";
import { pullFromApollo } from "./apollo-pull";
import { useRouter } from "next/navigation";
import type { Database } from "@/lib/database.types";

type Lead = Database["public"]["Tables"]["outreach_leads"]["Row"];

interface Batch {
  id: string;
  count: number;
  uploaded: number;
  date: string;
}

function downloadCSV(leads: Lead[]) {
  const headers = [
    "email", "first_name", "last_name", "company_name", "title",
    "industry", "employee_count", "location", "revenue", "phone",
    "linkedin_url", "source", "batch_id", "status", "campaign_name",
  ];
  const rows = leads.map((l) =>
    headers.map((h) => {
      const val = String(l[h as keyof Lead] ?? "");
      return val.includes(",") ? `"${val}"` : val;
    }).join(",")
  );
  const csv = [headers.join(","), ...rows].join("\n");
  const blob = new Blob([csv], { type: "text/csv" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `outreach-leads-pending-${new Date().toISOString().slice(0, 10)}.csv`;
  a.click();
  URL.revokeObjectURL(url);
}

export function OutreachDashboard({
  stats,
  batches,
  leads,
}: {
  stats: { total: number; uploaded: number; pending: number };
  batches: Batch[];
  leads: Lead[];
}) {
  const [markingBatch, setMarkingBatch] = useState<string | null>(null);
  const [pulling, setPulling] = useState(false);
  const [pullResult, setPullResult] = useState<{ newLeadsSaved: number; duplicatesSkipped: number } | null>(null);
  const [pullError, setPullError] = useState<string | null>(null);
  const router = useRouter();

  const pendingLeads = leads.filter((l) => !l.uploaded_to_instantly);

  async function handlePullFromApollo() {
    setPulling(true);
    setPullResult(null);
    setPullError(null);
    try {
      const result = await pullFromApollo();
      setPullResult({ newLeadsSaved: result.newLeadsSaved, duplicatesSkipped: result.duplicatesSkipped });
      router.refresh();
    } catch (err) {
      setPullError(err instanceof Error ? err.message : "Pull failed");
    } finally {
      setPulling(false);
    }
  }

  async function handleMarkBatch(batchId: string) {
    setMarkingBatch(batchId);
    try {
      await markBatchUploaded(batchId);
      router.refresh();
    } catch (err) {
      alert(err instanceof Error ? err.message : "Failed");
    } finally {
      setMarkingBatch(null);
    }
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-zinc-900">Outreach</h2>
        <button
          onClick={handlePullFromApollo}
          disabled={pulling}
          className="rounded-lg bg-zinc-900 px-5 py-2.5 text-xs font-semibold text-white hover:bg-zinc-800 disabled:opacity-50 transition-colors"
        >
          {pulling ? "Pulling leads from Apollo..." : "Generate New Batch"}
        </button>
      </div>

      {pullResult && (
        <div className="rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-3">
          <p className="text-sm font-medium text-emerald-800">
            {pullResult.newLeadsSaved} new leads saved, {pullResult.duplicatesSkipped} duplicates skipped.
          </p>
        </div>
      )}

      {pullError && (
        <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3">
          <p className="text-sm font-medium text-red-800">{pullError}</p>
        </div>
      )}

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: "Total Leads", value: stats.total },
          { label: "Pending Upload", value: stats.pending },
          { label: "Uploaded to Instantly", value: stats.uploaded },
        ].map((s) => (
          <div key={s.label} className="rounded-lg border border-zinc-200 bg-white p-4">
            <p className="text-[10px] font-semibold uppercase tracking-wider text-zinc-500">{s.label}</p>
            <p className="mt-1 text-2xl font-semibold text-zinc-900">{s.value}</p>
          </div>
        ))}
      </div>

      {/* Actions */}
      {pendingLeads.length > 0 && (
        <div>
          <button
            onClick={() => downloadCSV(pendingLeads)}
            className="rounded-lg bg-zinc-900 px-5 py-2.5 text-xs font-semibold text-white hover:bg-zinc-800 transition-colors"
          >
            Download {pendingLeads.length} Pending Leads as CSV
          </button>
        </div>
      )}

      {/* Batches */}
      {batches.length > 0 && (
        <div>
          <h3 className="mb-3 text-[10px] font-semibold uppercase tracking-wider text-zinc-500">Batches</h3>
          <div className="overflow-hidden rounded-lg border border-zinc-200">
            <table className="w-full text-sm">
              <thead className="border-b border-zinc-200 bg-zinc-50">
                <tr>
                  {["Batch ID", "Leads", "Uploaded", "Date", ""].map((h) => (
                    <th key={h} className="px-4 py-2.5 text-left text-[10px] font-semibold uppercase tracking-wider text-zinc-500">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-100">
                {batches.map((b) => {
                  const allUploaded = b.uploaded === b.count;
                  return (
                    <tr key={b.id} className="bg-white">
                      <td className="px-4 py-2.5 font-medium text-zinc-900 font-mono text-xs">{b.id}</td>
                      <td className="px-4 py-2.5 text-zinc-600">{b.count}</td>
                      <td className="px-4 py-2.5">
                        <span className={`rounded-full border px-2 py-0.5 text-xs font-medium ${allUploaded ? "border-emerald-200 bg-emerald-50 text-emerald-700" : "border-amber-200 bg-amber-50 text-amber-700"}`}>
                          {b.uploaded}/{b.count}
                        </span>
                      </td>
                      <td className="px-4 py-2.5 text-zinc-400 text-xs">{new Date(b.date).toLocaleDateString()}</td>
                      <td className="px-4 py-2.5">
                        {!allUploaded && (
                          <button
                            onClick={() => handleMarkBatch(b.id)}
                            disabled={markingBatch === b.id}
                            className="rounded-md border border-zinc-300 bg-white px-3 py-1.5 text-xs font-semibold text-zinc-700 hover:bg-zinc-50 disabled:opacity-50 transition-colors"
                          >
                            {markingBatch === b.id ? "Marking..." : "Mark Uploaded"}
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
      )}

      {/* Recent Leads */}
      <div>
        <h3 className="mb-3 text-[10px] font-semibold uppercase tracking-wider text-zinc-500">
          Recent Leads ({leads.length})
        </h3>
        {leads.length === 0 ? (
          <p className="py-12 text-center text-sm text-zinc-400">No leads yet.</p>
        ) : (
          <div className="overflow-x-auto rounded-lg border border-zinc-200">
            <table className="w-full text-sm">
              <thead className="border-b border-zinc-200 bg-zinc-50">
                <tr>
                  {["Name", "Company", "Title", "Email", "Status", "Batch", "Uploaded"].map((h) => (
                    <th key={h} className="px-4 py-2.5 text-left text-[10px] font-semibold uppercase tracking-wider text-zinc-500">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-100">
                {leads.map((l) => (
                  <tr key={l.id} className="bg-white hover:bg-zinc-50 transition-colors">
                    <td className="px-4 py-2.5 font-medium text-zinc-900">
                      {[l.first_name, l.last_name].filter(Boolean).join(" ") || "—"}
                    </td>
                    <td className="px-4 py-2.5 text-zinc-600">{l.company_name || "—"}</td>
                    <td className="px-4 py-2.5 text-zinc-500 text-xs">{l.title || "—"}</td>
                    <td className="px-4 py-2.5 text-zinc-600 text-xs">{l.email}</td>
                    <td className="px-4 py-2.5">
                      <span className={`rounded-full border px-2 py-0.5 text-xs font-medium ${
                        l.status === "new" ? "border-blue-200 bg-blue-50 text-blue-700" :
                        l.status === "rejected" ? "border-red-200 bg-red-50 text-red-700" :
                        "border-zinc-200 bg-zinc-50 text-zinc-600"
                      }`}>
                        {l.status || "—"}
                      </span>
                    </td>
                    <td className="px-4 py-2.5 text-zinc-400 font-mono text-xs">{l.batch_id || "—"}</td>
                    <td className="px-4 py-2.5">
                      {l.uploaded_to_instantly ? (
                        <span className="rounded-full border border-emerald-200 bg-emerald-50 px-2 py-0.5 text-xs font-medium text-emerald-700">Yes</span>
                      ) : (
                        <span className="rounded-full border border-zinc-200 bg-zinc-50 px-2 py-0.5 text-xs font-medium text-zinc-500">No</span>
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
