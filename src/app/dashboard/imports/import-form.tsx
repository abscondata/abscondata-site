"use client";

import { useState } from "react";
import { processImport } from "./actions";
import { useRouter } from "next/navigation";

function parseCSV(text: string): Record<string, string>[] {
  const lines = text.trim().split("\n");
  if (lines.length < 2) return [];
  const headers = lines[0].split(",").map((h) => h.trim().replace(/^"|"$/g, "").toLowerCase().replace(/\s+/g, "_"));
  return lines.slice(1).map((line) => {
    const values = line.split(",").map((v) => v.trim().replace(/^"|"$/g, ""));
    const row: Record<string, string> = {};
    headers.forEach((h, i) => { row[h] = values[i] || ""; });
    return row;
  });
}

export function ImportForm({ clients }: { clients: { id: number; name: string }[] }) {
  const [clientId, setClientId] = useState("");
  const [importType, setImportType] = useState("overdue_accounts");
  const [fileName, setFileName] = useState("");
  const [rows, setRows] = useState<Record<string, string>[]>([]);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<{ importId: string; taskCount: number } | null>(null);
  const router = useRouter();

  function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setFileName(file.name);
    const reader = new FileReader();
    reader.onload = (ev) => {
      const text = ev.target?.result as string;
      setRows(parseCSV(text));
    };
    reader.readAsText(file);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!clientId || rows.length === 0) return;
    setLoading(true);
    try {
      const res = await processImport(Number(clientId), importType, fileName, rows);
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

        {rows.length > 0 && (
          <div>
            <p className="mb-2 text-xs font-medium text-zinc-600 dark:text-zinc-400">Preview ({rows.length} rows total, showing first 5)</p>
            <div className="overflow-x-auto rounded border border-zinc-200 dark:border-zinc-700">
              <table className="w-full text-xs">
                <thead className="bg-zinc-50 dark:bg-zinc-800">
                  <tr>
                    {Object.keys(rows[0]).map((h) => <th key={h} className="px-3 py-1.5 text-left font-medium text-zinc-600 dark:text-zinc-400">{h}</th>)}
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800">
                  {rows.slice(0, 5).map((row, i) => (
                    <tr key={i}>
                      {Object.values(row).map((v, j) => <td key={j} className="px-3 py-1.5 text-zinc-700 dark:text-zinc-300">{v}</td>)}
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
