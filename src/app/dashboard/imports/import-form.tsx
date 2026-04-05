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
      // Auto-guess column mappings
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

  // Remap rows using the column mapping before sending to server
  function remapRows(): Record<string, string>[] {
    return rows.map((row) => {
      const mapped: Record<string, string> = {};
      // Keep all original columns
      for (const [csvCol, val] of Object.entries(row)) {
        mapped[csvCol] = val;
      }
      // Add normalized field names based on mapping
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

  const inputClasses = "rounded-md border border-zinc-200 bg-white px-3 py-2 text-sm dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-100";

  return (
    <div>
      <h2 className="mb-4 text-lg font-semibold text-zinc-900 dark:text-zinc-100">Import Data</h2>

      {result && (
        <div className="mb-4 rounded-lg border border-green-200 bg-green-50 p-4 dark:border-green-800 dark:bg-green-900/20">
          <p className="text-sm font-medium text-green-700 dark:text-green-400">
            Import complete — {result.taskCount} tasks created.
          </p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4 rounded-lg border border-zinc-200 bg-white p-5 dark:border-zinc-800 dark:bg-zinc-900">
        <div className="grid gap-4 sm:grid-cols-3">
          <div>
            <label className="mb-1 block text-xs font-medium text-zinc-600 dark:text-zinc-400">Client</label>
            <select value={clientId} onChange={(e) => setClientId(e.target.value)} required className={`w-full ${inputClasses}`}>
              <option value="">Select client...</option>
              {clients.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>
          </div>
          <div>
            <label className="mb-1 block text-xs font-medium text-zinc-600 dark:text-zinc-400">Import Type</label>
            <select value={importType} onChange={(e) => setImportType(e.target.value)} className={`w-full ${inputClasses}`}>
              <option value="overdue_accounts">Overdue Accounts</option>
              <option value="invoices">Invoices</option>
              <option value="customers">Customers</option>
            </select>
          </div>
          <div>
            <label className="mb-1 block text-xs font-medium text-zinc-600 dark:text-zinc-400">CSV File</label>
            <input type="file" accept=".csv" onChange={handleFile} className="w-full text-sm text-zinc-600 file:mr-3 file:rounded-md file:border-0 file:bg-zinc-100 file:px-3 file:py-1.5 file:text-xs file:font-medium file:text-zinc-700 dark:text-zinc-400 dark:file:bg-zinc-800 dark:file:text-zinc-300" />
          </div>
        </div>

        {/* Column Mapping */}
        {headers.length > 0 && (
          <div>
            <p className="mb-2 text-xs font-medium text-zinc-600 dark:text-zinc-400">Column Mapping</p>
            <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-4">
              {headers.map((h) => (
                <div key={h} className="flex items-center gap-2">
                  <span className="min-w-0 flex-1 truncate text-xs text-zinc-700 dark:text-zinc-300" title={h}>{h}</span>
                  <span className="text-zinc-400">→</span>
                  <select
                    value={columnMap[h] || ""}
                    onChange={(e) => updateMapping(h, e.target.value)}
                    className="flex-1 rounded border border-zinc-200 px-2 py-1 text-xs dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-100"
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
            <p className="mb-2 text-xs font-medium text-zinc-600 dark:text-zinc-400">Preview ({rows.length} rows total, showing first 5)</p>
            <div className="overflow-x-auto rounded border border-zinc-200 dark:border-zinc-700">
              <table className="w-full text-xs">
                <thead className="bg-zinc-50 dark:bg-zinc-800">
                  <tr>
                    {headers.map((h) => (
                      <th key={h} className="px-3 py-1.5 text-left font-medium text-zinc-600 dark:text-zinc-400">
                        {h}
                        {columnMap[h] && (
                          <span className="ml-1 font-normal text-blue-500">→ {columnMap[h].replace(/_/g, " ")}</span>
                        )}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800">
                  {rows.slice(0, 5).map((row, i) => (
                    <tr key={i}>
                      {headers.map((h) => <td key={h} className="px-3 py-1.5 text-zinc-700 dark:text-zinc-300">{row[h]}</td>)}
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
          className="rounded-md bg-zinc-900 px-4 py-2 text-sm font-medium text-white hover:bg-zinc-800 disabled:opacity-50 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-200"
        >
          {loading ? "Importing..." : `Import ${rows.length} rows`}
        </button>
      </form>
    </div>
  );
}
