"use client";

import { useState } from "react";
import { bulkCreateTasks } from "./bulk-actions";
import { useRouter } from "next/navigation";
import { useToast } from "../../components/toast";

const SERVICE_OPTIONS = [
  { key: "payment_followup", label: "Payment Follow-Up" },
  { key: "invoice_ops", label: "Invoice Ops" },
  { key: "review_requests", label: "Review Requests" },
  { key: "weekly_summary", label: "Weekly Summary" },
];

interface ParsedRow {
  recipient_name: string;
  recipient_email: string;
  amount: string;
  notes: string;
}

function parseRows(text: string): ParsedRow[] {
  return text
    .split("\n")
    .map((line) => line.trim())
    .filter((line) => line.length > 0)
    .map((line) => {
      // Split by comma or tab
      const parts = line.includes("\t") ? line.split("\t") : line.split(",");
      const trimmed = parts.map((p) => p.trim());
      return {
        recipient_name: trimmed[0] || "",
        recipient_email: trimmed[1] || "",
        amount: trimmed[2] || "",
        notes: trimmed[3] || "",
      };
    })
    .filter((r) => r.recipient_name);
}

export function BulkTaskForm({ clientId }: { clientId: number }) {
  const [open, setOpen] = useState(false);
  const [serviceKey, setServiceKey] = useState("payment_followup");
  const [rawText, setRawText] = useState("");
  const [preview, setPreview] = useState<ParsedRow[] | null>(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<number | null>(null);
  const router = useRouter();
  const { toast } = useToast();

  function handlePreview() {
    const rows = parseRows(rawText);
    setPreview(rows);
  }

  async function handleCreate() {
    if (!preview || preview.length === 0) return;
    setLoading(true);
    try {
      const res = await bulkCreateTasks(clientId, serviceKey, preview);
      if (res.success) {
        toast(res.message, "success");
        setResult(res.count ?? 0);
        setRawText("");
        setPreview(null);
        router.refresh();
      } else {
        toast(res.message, "error");
      }
    } catch (err) {
      toast(err instanceof Error ? err.message : "Bulk creation failed", "error");
    } finally {
      setLoading(false);
    }
  }

  if (!open) {
    return (
      <button
        onClick={() => setOpen(true)}
        className="rounded-lg border border-zinc-300 bg-white px-4 py-1.5 text-xs font-semibold text-zinc-700 hover:bg-zinc-50 transition-colors"
      >
        Bulk Create
      </button>
    );
  }

  const inputClasses = "w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-900 placeholder-zinc-400 focus:border-zinc-400 focus:outline-none";

  return (
    <div className="mt-3 rounded-lg border border-zinc-200 bg-white p-5 space-y-4">
      <div className="flex items-center justify-between">
        <h4 className="text-sm font-semibold text-zinc-900">Bulk Create Tasks</h4>
        <button onClick={() => { setOpen(false); setPreview(null); setResult(null); }} className="text-xs text-zinc-400 hover:text-zinc-700">Cancel</button>
      </div>

      {result !== null && (
        <div className="rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-3">
          <p className="text-sm font-medium text-emerald-800">{result} tasks created.</p>
        </div>
      )}

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className="mb-1.5 block text-[10px] font-medium uppercase tracking-wider text-zinc-500">Service</label>
          <select value={serviceKey} onChange={(e) => setServiceKey(e.target.value)} className={inputClasses}>
            {SERVICE_OPTIONS.map((s) => <option key={s.key} value={s.key}>{s.label}</option>)}
          </select>
        </div>
      </div>

      <div>
        <label className="mb-1.5 block text-[10px] font-medium uppercase tracking-wider text-zinc-500">
          Paste rows (name, email, amount, notes)
        </label>
        <textarea
          value={rawText}
          onChange={(e) => { setRawText(e.target.value); setPreview(null); setResult(null); }}
          rows={6}
          className={inputClasses}
          placeholder={"John Smith, john@example.com, 1500, Invoice #1042 overdue 30 days\nJane Doe, jane@example.com, 3200, Invoice #1089 overdue 60 days"}
        />
      </div>

      <div className="flex gap-3">
        <button
          onClick={handlePreview}
          disabled={!rawText.trim()}
          className="rounded-lg border border-zinc-300 bg-white px-5 py-2 text-xs font-semibold text-zinc-700 hover:bg-zinc-50 disabled:opacity-50 transition-colors"
        >
          Preview
        </button>
        {preview && preview.length > 0 && (
          <button
            onClick={handleCreate}
            disabled={loading}
            className="inline-flex items-center gap-2 rounded-lg bg-zinc-900 px-5 py-2 text-xs font-semibold text-white hover:bg-zinc-800 disabled:opacity-50 transition-colors"
          >
            {loading && <span className="inline-block h-3 w-3 animate-spin rounded-full border-2 border-white border-t-transparent" />}
            {loading ? "Creating..." : `Create ${preview.length} Tasks`}
          </button>
        )}
      </div>

      {/* Preview table */}
      {preview && preview.length > 0 && (
        <div className="overflow-x-auto rounded-lg border border-zinc-200">
          <table className="w-full text-xs">
            <thead className="border-b border-zinc-200 bg-zinc-50">
              <tr>
                {["Name", "Email", "Amount", "Notes"].map((h) => (
                  <th key={h} className="px-3 py-2 text-left text-[10px] font-medium uppercase tracking-wider text-zinc-500">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100">
              {preview.map((row, i) => (
                <tr key={i} className="bg-white">
                  <td className="px-3 py-2 font-medium text-zinc-900">{row.recipient_name}</td>
                  <td className="px-3 py-2 text-zinc-600">{row.recipient_email || "—"}</td>
                  <td className="px-3 py-2 text-zinc-600">{row.amount ? `$${row.amount}` : "—"}</td>
                  <td className="px-3 py-2 text-zinc-500">{row.notes || "—"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {preview && preview.length === 0 && (
        <p className="text-sm text-zinc-400">No valid rows found. Each line needs at least a name.</p>
      )}
    </div>
  );
}
