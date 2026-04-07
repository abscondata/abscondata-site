"use client";

import { useState } from "react";
import { markBatchUploaded, updateLeadResponse } from "./actions";
import { pullFromApollo } from "./apollo-pull";
import { backfillLeadSegmentation } from "./backfill-actions";
import { useRouter } from "next/navigation";
import { useToast } from "../components/toast";
import { EmptyState } from "../components/ui";
import type { Database } from "@/lib/database.types";

type Lead = Database["public"]["Tables"]["outreach_leads"]["Row"];
// Extended lead type with columns from migration 010
type LeadExt = Lead & {
  segment?: string | null;
  personalization_line?: string | null;
  response_status?: string | null;
  response_notes?: string | null;
  response_date?: string | null;
};

interface Batch {
  id: string;
  count: number;
  uploaded: number;
  date: string;
}

function escapeCSV(val: string): string {
  if (val.includes(",") || val.includes('"') || val.includes("\n")) {
    return `"${val.replace(/"/g, '""')}"`;
  }
  return val;
}

function fallbackPersonalization(title: string | null, company: string | null): string {
  if (title && company) {
    return `As ${title} at ${company}, you know how much time back-office work takes.`;
  }
  if (company) {
    return `Running ${company}, you know how much time back-office work takes.`;
  }
  return "You know how much time back-office work takes.";
}

function downloadInstantlyCSV(leads: LeadExt[], batchId?: string) {
  const headers = ["email", "first_name", "last_name", "company_name", "personalization"];
  const rows = leads.map((l) => {
    const firstName = l.first_name || "";
    const lastName = l.last_name || "";
    const personalization = l.personalization_line || fallbackPersonalization(l.title, l.company_name);
    return [
      escapeCSV(l.email),
      escapeCSV(firstName),
      escapeCSV(lastName),
      escapeCSV(l.company_name || ""),
      escapeCSV(personalization),
    ].join(",");
  });
  const csv = [headers.join(","), ...rows].join("\n");
  const blob = new Blob([csv], { type: "text/csv" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  const date = new Date().toISOString().slice(0, 10);
  a.download = `abscondata_leads_${date}${batchId ? `_${batchId}` : ""}.csv`;
  a.click();
  URL.revokeObjectURL(url);
}

export function OutreachDashboard({
  stats,
  batches,
  leads,
  pipelineStats = { sent: 0, replied: 0, interested: 0, call_booked: 0, not_interested: 0 },
}: {
  stats: { total: number; uploaded: number; pending: number };
  batches: Batch[];
  leads: LeadExt[];
  pipelineStats?: { sent: number; replied: number; interested: number; call_booked: number; not_interested: number };
}) {
  const [pipelineFilter, setPipelineFilter] = useState<string | null>(null);
  const [markingBatch, setMarkingBatch] = useState<string | null>(null);
  const [pulling, setPulling] = useState(false);
  const [backfilling, setBackfilling] = useState(false);
  const [pullResult, setPullResult] = useState<{ newLeadsSaved: number; duplicatesSkipped: number; revealed: number; skippedNoEmail: number } | null>(null);
  const [pullError, setPullError] = useState<string | null>(null);
  const [expandedBatch, setExpandedBatch] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const router = useRouter();
  const { toast } = useToast();

  const pendingLeads = leads.filter((l) => !l.uploaded_to_instantly);
  const respondedLeads = leads.filter((l) => l.response_status && l.response_status !== "no_response");

  async function handleResponseUpdate(leadId: string, status: string) {
    const result = await updateLeadResponse(leadId, status);
    if (result.success) { toast("Updated", "success"); router.refresh(); }
    else toast(result.message, "error");
  }

  const searchLower = search.toLowerCase();
  const filteredLeads = search
    ? leads.filter((l) =>
        (l.first_name || "").toLowerCase().includes(searchLower) ||
        (l.last_name || "").toLowerCase().includes(searchLower) ||
        l.email.toLowerCase().includes(searchLower) ||
        (l.company_name || "").toLowerCase().includes(searchLower)
      )
    : leads;

  async function handlePullFromApollo() {
    setPulling(true);
    setPullResult(null);
    setPullError(null);
    try {
      const result = await pullFromApollo();
      setPullResult({ newLeadsSaved: result.newLeadsSaved, duplicatesSkipped: result.duplicatesSkipped, revealed: result.revealed, skippedNoEmail: result.skippedNoEmail });
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
      toast("Batch marked as uploaded", "success");
      router.refresh();
    } catch (err) {
      toast(err instanceof Error ? err.message : "Failed to mark batch", "error");
    } finally {
      setMarkingBatch(null);
    }
  }

  function handleDownloadBatch(batchId: string) {
    const batchLeads = leads.filter((l) => l.batch_id === batchId && !l.uploaded_to_instantly);
    if (batchLeads.length === 0) return;
    downloadInstantlyCSV(batchLeads, batchId);
  }

  return (
    <div className="space-y-8">
      {/* Send Time Guidance */}
      <div className="rounded-lg border border-zinc-200 bg-zinc-50 px-4 py-3">
        <p className="text-xs font-semibold text-zinc-700 mb-1">Optimal Send Times (Eastern)</p>
        <p className="text-sm text-zinc-600 leading-relaxed">
          Service business owners check email at:
          {" "}6:00–7:30 AM (before job sites)
          {" · "}12:00–1:00 PM (lunch break)
          {" · "}7:30–9:00 PM (end of day).
          {" "}Set Instantly send windows to these for best reply rates.
        </p>
      </div>

      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-zinc-900">Outreach</h2>
        <div className="flex items-center gap-3">
          {leads.some((l) => !(l as LeadExt).segment) && (
            <button
              onClick={async () => {
                setBackfilling(true);
                try {
                  const result = await backfillLeadSegmentation();
                  if (result.success) { toast(result.message, "success"); router.refresh(); }
                  else toast(result.message, "error");
                } catch (err) { toast(err instanceof Error ? err.message : "Backfill failed", "error"); }
                finally { setBackfilling(false); }
              }}
              disabled={backfilling}
              className="rounded-lg border border-zinc-300 bg-white px-4 py-2.5 text-xs font-semibold text-zinc-700 hover:bg-zinc-50 disabled:opacity-50 transition-colors"
            >
              {backfilling ? "Backfilling..." : "Backfill Segments"}
            </button>
          )}
          <button
            onClick={handlePullFromApollo}
            disabled={pulling}
            className="rounded-lg bg-zinc-900 px-5 py-2.5 text-xs font-semibold text-white hover:bg-zinc-800 disabled:opacity-50 transition-colors"
          >
            {pulling ? "Pulling leads from Apollo..." : "Generate New Batch"}
          </button>
        </div>
      </div>

      {pullResult && (
        <div className="rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-3">
          <p className="text-sm font-medium text-emerald-800">
            {pullResult.revealed} contacts revealed, {pullResult.newLeadsSaved} new leads saved, {pullResult.duplicatesSkipped} duplicates skipped, {pullResult.skippedNoEmail} had no email.
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

      {/* Response Pipeline */}
      <div>
        <h3 className="mb-3 text-[10px] font-semibold uppercase tracking-wider text-zinc-500">Pipeline</h3>
        <div className="grid grid-cols-5 gap-3">
          {([
            { key: "uploaded", label: "Sent", value: pipelineStats.sent, color: "text-zinc-900" },
            { key: "replied", label: "Replied", value: pipelineStats.replied, color: "text-blue-700" },
            { key: "interested", label: "Interested", value: pipelineStats.interested, color: "text-emerald-700" },
            { key: "call_booked", label: "Calls Booked", value: pipelineStats.call_booked, color: "text-violet-700" },
            { key: "not_interested", label: "Not Interested", value: pipelineStats.not_interested, color: "text-zinc-500" },
          ] as const).map((s) => (
            <button
              key={s.key}
              onClick={() => setPipelineFilter(pipelineFilter === s.key ? null : s.key)}
              className={`rounded-lg border bg-white p-3 text-left transition-colors ${pipelineFilter === s.key ? "border-zinc-400" : "border-zinc-200 hover:border-zinc-300"}`}
            >
              <p className="text-[10px] font-semibold uppercase tracking-wider text-zinc-500">{s.label}</p>
              <p className={`mt-1 text-xl font-semibold ${s.color}`}>{s.value}</p>
            </button>
          ))}
        </div>
        {respondedLeads.length > 0 && (
          <div className="mt-3 overflow-hidden rounded-lg border border-zinc-200">
            <table className="w-full text-sm">
              <thead className="border-b border-zinc-200 bg-zinc-50">
                <tr>
                  {["Name", "Company", "Status", "Notes", "Date"].map((h) => (
                    <th key={h} className="px-4 py-2 text-left text-[10px] font-semibold uppercase tracking-wider text-zinc-500">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-100">
                {respondedLeads.slice(0, 25).map((l) => (
                  <tr key={l.id} className="bg-white">
                    <td className="px-4 py-2 text-xs font-medium text-zinc-900">{[l.first_name, l.last_name].filter(Boolean).join(" ") || "—"}</td>
                    <td className="px-4 py-2 text-xs text-zinc-600">{l.company_name || "—"}</td>
                    <td className="px-4 py-2">
                      <ResponseStatusSelect leadId={l.id} currentStatus={l.response_status || "no_response"} onUpdate={handleResponseUpdate} />
                    </td>
                    <td className="px-4 py-2 text-xs text-zinc-500">{l.response_notes || "—"}</td>
                    <td className="px-4 py-2 text-xs text-zinc-400">{l.response_date ? new Date(l.response_date).toLocaleDateString() : "—"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Download all pending */}
      {pendingLeads.length > 0 && (
        <div>
          <button
            onClick={() => downloadInstantlyCSV(pendingLeads)}
            className="rounded-lg bg-zinc-900 px-5 py-2.5 text-xs font-semibold text-white hover:bg-zinc-800 transition-colors"
          >
            Download All {pendingLeads.length} Pending Leads (Instantly CSV)
          </button>
        </div>
      )}

      {/* Batches */}
      {batches.length > 0 && (
        <div>
          <h3 className="mb-3 text-[10px] font-semibold uppercase tracking-wider text-zinc-500">Batches</h3>
          <div className="space-y-2">
            {batches.map((b) => {
              const allUploaded = b.uploaded === b.count;
              const notUploaded = b.count - b.uploaded;
              const isExpanded = expandedBatch === b.id;
              const batchLeads = leads.filter((l) => l.batch_id === b.id);

              return (
                <div key={b.id} className="rounded-lg border border-zinc-200 bg-white">
                  {/* Batch header */}
                  <div className="flex items-center justify-between px-4 py-3">
                    <button onClick={() => setExpandedBatch(isExpanded ? null : b.id)} className="flex items-center gap-3 text-left">
                      <span className="text-zinc-300">{isExpanded ? "▲" : "▼"}</span>
                      <span className="font-mono text-xs font-medium text-zinc-900">{b.id}</span>
                      <span className="text-xs text-zinc-500">{new Date(b.date).toLocaleDateString()}</span>
                      <span className="text-xs text-zinc-500">{b.count} leads</span>
                      <span className={`rounded-full border px-2 py-0.5 text-xs font-medium ${allUploaded ? "border-emerald-200 bg-emerald-50 text-emerald-700" : "border-amber-200 bg-amber-50 text-amber-700"}`}>
                        {b.uploaded}/{b.count} uploaded
                      </span>
                    </button>
                    <div className="flex items-center gap-2">
                      {notUploaded > 0 && (
                        <>
                          <button
                            onClick={() => handleDownloadBatch(b.id)}
                            className="rounded-md border border-zinc-300 bg-white px-3 py-1.5 text-xs font-semibold text-zinc-700 hover:bg-zinc-50 transition-colors"
                          >
                            Download CSV ({notUploaded})
                          </button>
                          <button
                            onClick={() => handleMarkBatch(b.id)}
                            disabled={markingBatch === b.id}
                            className="rounded-md border border-zinc-300 bg-white px-3 py-1.5 text-xs font-semibold text-zinc-700 hover:bg-zinc-50 disabled:opacity-50 transition-colors"
                          >
                            {markingBatch === b.id ? "Marking..." : "Mark Uploaded"}
                          </button>
                        </>
                      )}
                    </div>
                  </div>

                  {/* Batch detail */}
                  {isExpanded && batchLeads.length > 0 && (
                    <div className="border-t border-zinc-100">
                      <table className="w-full text-sm">
                        <thead className="bg-zinc-50">
                          <tr>
                            {["Name", "Email", "Company", "Title", "Status", "Uploaded"].map((h) => (
                              <th key={h} className="px-4 py-2 text-left text-[10px] font-semibold uppercase tracking-wider text-zinc-500">{h}</th>
                            ))}
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-zinc-100">
                          {batchLeads.map((l) => (
                            <tr key={l.id} className="bg-white">
                              <td className="px-4 py-2 text-xs font-medium text-zinc-900">{[l.first_name, l.last_name].filter(Boolean).join(" ") || "—"}</td>
                              <td className="px-4 py-2 text-xs text-zinc-600">{l.email}</td>
                              <td className="px-4 py-2 text-xs text-zinc-600">{l.company_name || "—"}</td>
                              <td className="px-4 py-2 text-xs text-zinc-500">{l.title || "—"}</td>
                              <td className="px-4 py-2">
                                <ResponseStatusSelect leadId={l.id} currentStatus={(l as LeadExt).response_status || "no_response"} onUpdate={handleResponseUpdate} />
                              </td>
                              <td className="px-4 py-2">
                                {l.uploaded_to_instantly ? (
                                  <span className="rounded-full border border-emerald-200 bg-emerald-50 px-2 py-0.5 text-[10px] font-medium text-emerald-700">Yes</span>
                                ) : (
                                  <span className="rounded-full border border-zinc-200 bg-zinc-50 px-2 py-0.5 text-[10px] font-medium text-zinc-500">No</span>
                                )}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Lead Search */}
      <div>
        <div className="mb-3 flex items-center justify-between">
          <h3 className="text-[10px] font-semibold uppercase tracking-wider text-zinc-500">
            All Leads ({filteredLeads.length}{search ? ` of ${leads.length}` : ""})
          </h3>
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search name, email, company..."
            className="w-64 rounded-lg border border-zinc-300 bg-white px-3 py-1.5 text-xs text-zinc-900 placeholder-zinc-400 focus:border-zinc-400 focus:outline-none"
          />
        </div>
        {filteredLeads.length === 0 ? (
          search
            ? <EmptyState message="No leads match your search." />
            : <EmptyState message="No leads loaded. Pull from Apollo to start prospecting." />
        ) : (
          <div className="overflow-x-auto rounded-lg border border-zinc-200">
            <table className="w-full text-sm">
              <thead className="border-b border-zinc-200 bg-zinc-50">
                <tr>
                  {["Name", "Company", "Title", "Email", "Batch", "Uploaded"].map((h) => (
                    <th key={h} className="px-4 py-2.5 text-left text-[10px] font-semibold uppercase tracking-wider text-zinc-500">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-100">
                {filteredLeads.slice(0, 100).map((l) => (
                  <tr key={l.id} className="bg-white hover:bg-zinc-50 transition-colors">
                    <td className="px-4 py-2.5 font-medium text-zinc-900 text-xs">
                      {[l.first_name, l.last_name].filter(Boolean).join(" ") || "—"}
                    </td>
                    <td className="px-4 py-2.5 text-zinc-600 text-xs">{l.company_name || "—"}</td>
                    <td className="px-4 py-2.5 text-zinc-500 text-xs">{l.title || "—"}</td>
                    <td className="px-4 py-2.5 text-zinc-600 text-xs">{l.email}</td>
                    <td className="px-4 py-2.5 text-zinc-400 font-mono text-xs">{l.batch_id || "—"}</td>
                    <td className="px-4 py-2.5">
                      {l.uploaded_to_instantly ? (
                        <span className="rounded-full border border-emerald-200 bg-emerald-50 px-2 py-0.5 text-[10px] font-medium text-emerald-700">Yes</span>
                      ) : (
                        <span className="rounded-full border border-zinc-200 bg-zinc-50 px-2 py-0.5 text-[10px] font-medium text-zinc-500">No</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {filteredLeads.length > 100 && (
              <div className="border-t border-zinc-100 px-4 py-2 text-xs text-zinc-400">
                Showing first 100 of {filteredLeads.length} leads
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

const RESPONSE_STYLES: Record<string, string> = {
  no_response: "border-zinc-200 bg-zinc-50 text-zinc-600",
  opened: "border-blue-200 bg-blue-50 text-blue-700",
  replied: "border-blue-200 bg-blue-50 text-blue-700",
  interested: "border-emerald-200 bg-emerald-50 text-emerald-700",
  call_booked: "border-violet-200 bg-violet-50 text-violet-700",
  not_interested: "border-zinc-200 bg-zinc-50 text-zinc-500",
  unsubscribed: "border-red-200 bg-red-50 text-red-700",
};

function ResponseStatusSelect({ leadId, currentStatus, onUpdate }: { leadId: string; currentStatus: string; onUpdate: (id: string, status: string) => void }) {
  return (
    <select
      value={currentStatus}
      onChange={(e) => onUpdate(leadId, e.target.value)}
      className={`rounded-full border px-2.5 py-0.5 text-[10px] font-medium focus:outline-none ${RESPONSE_STYLES[currentStatus] || RESPONSE_STYLES.no_response}`}
    >
      <option value="no_response">No Response</option>
      <option value="opened">Opened</option>
      <option value="replied">Replied</option>
      <option value="interested">Interested</option>
      <option value="call_booked">Call Booked</option>
      <option value="not_interested">Not Interested</option>
      <option value="unsubscribed">Unsubscribed</option>
    </select>
  );
}
