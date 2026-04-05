"use client";

import { useState } from "react";
import { processImport } from "./actions";
import { useRouter } from "next/navigation";

const KNOWN_FIELDS = [
  "customer_name", "customer_email", "customer_phone",
  "invoice_number", "amount", "due_date", "days_overdue", "notes",
];

function parseCSV(text: string): { headers: string[]; rows: Record<string, string>[] } {
  const lines = text.trim().split("\n");
  if (lines.length < 2) return { headers: [], rows: [] };
  const headers = lines[0].split(",").map((h) => h.trim().replace(/^"|"$/g, ""));
  const rows = lines.slice(1).map((line) => {
    const values = line.split(",").map((v) => v.trim().replace(/^"|"$/g, ""));
    const row: Record<string, string> = {};
    headers.forEach((h, i) => { row[h] = values[i] || ""; });
    return row;
  });
  return { headers, rows };
}

function guessMapping(header: string): string {
  const h = header.toLowerCase().replace(/\s+/g, "_");
  const map: Record<string, string> = {
    customer: "customer_name", customer_name: "customer_name", name: "customer_name",
    account: "customer_name", company: "customer_name", client: "customer_name",
    email: "customer_email", customer_email: "customer_email",
    phone: "customer_phone", customer_phone: "customer_phone",
    invoice: "invoice_number", invoice_number: "invoice_number", inv: "invoice_number",
    invoice_no: "invoice_number", "invoice_#": "invoice_number",
    amount: "amount", balance: "amount", total: "amount", amount_due: "amount",
    due_date: "due_date", date_due: "due_date", due: "due_date",
    days_overdue: "days_overdue", overdue_days: "days_overdue", aging: "days_overdue",
    notes: "notes", note: "notes", comments: "notes",
  };
  return map[h] || "";
}

export function ImportForm({ clients }: { clients: { id: number; name: string }[] }) {
  const [clientId, setClientId] = useState("");
  const [importType, setImportType] = useState("overdue_accounts");
  const [fileName, setFileName] = useState("");
  const [headers, setHeaders] = useState<string[]>([]);
  const [rows, setRows] = useState<Record<string, string>[]>([]);
  const [columnMap, setColumnMap] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<{ importId: string; taskCount: number } | null>(null);
  const router = useRouter();

  function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setFileName(file.name);
    setResult(null);
    const reader = new FileReader();
    reader.onload = (ev) => {
      const text = ev.target?.result as string;
      const parsed = parseCSV(text);
      setHeaders(parsed.headers);
      setRows(parsed.rows);
      const guessed: Record<string, string> = {};
      parsed.headers.forEach((h) => {
        const g = guessMapping(h);
        if (g) guessed[h] = g;
      });
      setColumnMap(guessed);
    };
    reader.readAsText(file);
  }

  function updateMapping(csvCol: string, field: string) {
    setColumnMap((prev) => ({ ...prev, [csvCol]: field }));
  }

  function remapRows(): Record<string, string>[] {
    return rows.map((row) => {
      const mapped: Record<string, string> = {};
      for (const [csvCol, val] of Object.entries(row)) {
        mapped[csvCol] = val;
      }
      for (const [csvCol, field] of Object.entries(columnMap)) {
        if (field && row[csvCol]) {
          mapped[field] = row[csvCol];
        }
      }
      return mapped;
    });
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!clientId || rows.length === 0) return;
    setLoading(true);
    try {
      const res = await processImport(Number(clientId), importType, fileName, remapRows());
      setResult(res);
      router.refresh();
    } catch (err) {
      alert(err instanceof Error ? err.message : "Import failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div>
      <h2 className="mb-5 text-lg font-semibold text-zinc-900">Import Data</h2>

      {result && (
        <div className="mb-5 rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-3">
          <p className="text-sm font-medium text-emerald-800">
            Import complete — {result.taskCount} tasks created.
          </p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-5 rounded-lg border border-zinc-200 bg-white p-6">
        <div className="grid gap-5 sm:grid-cols-3">
          <div>
            <label className="mb-1.5 block text-[10px] font-semibold uppercase tracking-wider text-zinc-500">Client</label>
            <select value={clientId} onChange={(e) => setClientId(e.target.value)} required className="w-full rounded-lg border border-zinc-300 bg-white px-3 py-2.5 text-sm text-zinc-900 focus:border-zinc-400 focus:outline-none">
              <option value="">Select client...</option>
              {clients.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>
          </div>
          <div>
            <label className="mb-1.5 block text-[10px] font-semibold uppercase tracking-wider text-zinc-500">Import Type</label>
            <select value={importType} onChange={(e) => setImportType(e.target.value)} className="w-full rounded-lg border border-zinc-300 bg-white px-3 py-2.5 text-sm text-zinc-900 focus:border-zinc-400 focus:outline-none">
              <option value="overdue_accounts">Overdue Accounts</option>
              <option value="invoices">Invoices</option>
              <option value="customers">Customers</option>
            </select>
          </div>
          <div>
            <label className="mb-1.5 block text-[10px] font-semibold uppercase tracking-wider text-zinc-500">CSV File</label>
            <input type="file" accept=".csv" onChange={handleFile} className="w-full text-sm text-zinc-600 file:mr-3 file:rounded-lg file:border file:border-zinc-300 file:bg-white file:px-3 file:py-2 file:text-xs file:font-semibold file:text-zinc-700 hover:file:bg-zinc-50" />
          </div>
        </div>

        {/* Column Mapping */}
        {headers.length > 0 && (
          <div>
            <label className="mb-2 block text-[10px] font-semibold uppercase tracking-wider text-zinc-500">Column Mapping</label>
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
              {headers.map((h) => (
                <div key={h} className="flex items-center gap-2 rounded-lg border border-zinc-100 bg-zinc-50 px-3 py-2">
                  <span className="min-w-0 flex-1 truncate text-xs font-medium text-zinc-700" title={h}>{h}</span>
                  <span className="text-zinc-300">→</span>
                  <select
                    value={columnMap[h] || ""}
                    onChange={(e) => updateMapping(h, e.target.value)}
                    className="flex-1 rounded-md border border-zinc-200 bg-white px-2 py-1 text-xs text-zinc-900 focus:border-zinc-400 focus:outline-none"
                  >
                    <option value="">(skip)</option>
                    {KNOWN_FIELDS.map((f) => (
                      <option key={f} value={f}>{f.replace(/_/g, " ")}</option>
                    ))}
                  </select>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Preview */}
        {rows.length > 0 && (
          <div>
            <label className="mb-2 block text-[10px] font-semibold uppercase tracking-wider text-zinc-500">Preview ({rows.length} rows total, showing first 5)</label>
            <div className="overflow-x-auto rounded-lg border border-zinc-200">
              <table className="w-full text-xs">
                <thead className="border-b border-zinc-200 bg-zinc-50">
                  <tr>
                    {headers.map((h) => (
                      <th key={h} className="px-3 py-2 text-left font-semibold text-zinc-600">
                        {h}
                        {columnMap[h] && (
                          <span className="ml-1 font-normal text-blue-600">→ {columnMap[h].replace(/_/g, " ")}</span>
                        )}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-100">
                  {rows.slice(0, 5).map((row, i) => (
                    <tr key={i} className="bg-white">
                      {headers.map((h) => <td key={h} className="px-3 py-2 text-zinc-900">{row[h]}</td>)}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        <button
          type="submit"
          disabled={loading || !clientId || rows.length === 0}
          className="rounded-lg bg-zinc-900 px-5 py-2.5 text-sm font-semibold text-white hover:bg-zinc-800 disabled:opacity-50 transition-colors"
        >
          {loading ? "Importing..." : `Import ${rows.length} rows`}
        </button>
      </form>
    </div>
  );
}
