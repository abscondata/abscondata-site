"use client";

import { useState } from "react";
import { createInvoice, updateInvoiceStatus } from "./invoice-actions";
import { useRouter } from "next/navigation";
import { useToast } from "../../components/toast";
import { SectionLabel, StatusBadge } from "../../components/ui";

interface Invoice {
  id: number;
  invoice_date: string;
  amount: number;
  status: string;
  notes: string | null;
}

const STATUS_STYLES: Record<string, string> = {
  sent: "bg-blue-50 text-blue-700",
  paid: "bg-emerald-50 text-emerald-700",
  overdue: "bg-red-50 text-red-700",
};

export function ClientInvoices({ clientId, invoices }: { clientId: number; invoices: Invoice[] }) {
  const [showAdd, setShowAdd] = useState(false);
  const router = useRouter();
  const { toast } = useToast();

  const totalInvoiced = invoices.reduce((s, i) => s + Number(i.amount), 0);
  const totalPaid = invoices.filter((i) => i.status === "paid").reduce((s, i) => s + Number(i.amount), 0);
  const totalOutstanding = totalInvoiced - totalPaid;

  async function handleStatusChange(invoiceId: number, newStatus: string) {
    const result = await updateInvoiceStatus(invoiceId, newStatus);
    if (result.success) {
      toast("Status updated", "success");
      router.refresh();
    } else {
      toast(result.message, "error");
    }
  }

  return (
    <div>
      <div className="mb-3 flex items-center justify-between">
        <SectionLabel>Billing</SectionLabel>
        <button
          onClick={() => setShowAdd(!showAdd)}
          className="text-[10px] font-semibold text-zinc-500 hover:text-zinc-700"
        >
          {showAdd ? "Cancel" : "+ Add Invoice"}
        </button>
      </div>

      {/* Totals */}
      <div className="mb-3 grid grid-cols-3 gap-3">
        <div className="rounded-lg bg-zinc-50 p-3">
          <p className="text-[10px] font-medium uppercase tracking-wider text-zinc-500">Invoiced</p>
          <p className="mt-0.5 text-lg font-semibold text-zinc-900">${totalInvoiced.toLocaleString("en-US", { minimumFractionDigits: 2 })}</p>
        </div>
        <div className="rounded-lg bg-zinc-50 p-3">
          <p className="text-[10px] font-medium uppercase tracking-wider text-zinc-500">Paid</p>
          <p className="mt-0.5 text-lg font-semibold text-emerald-700">${totalPaid.toLocaleString("en-US", { minimumFractionDigits: 2 })}</p>
        </div>
        <div className="rounded-lg bg-zinc-50 p-3">
          <p className="text-[10px] font-medium uppercase tracking-wider text-zinc-500">Outstanding</p>
          <p className="mt-0.5 text-lg font-semibold text-zinc-900">${totalOutstanding.toLocaleString("en-US", { minimumFractionDigits: 2 })}</p>
        </div>
      </div>

      {showAdd && <AddInvoiceForm clientId={clientId} toast={toast} onDone={() => { setShowAdd(false); router.refresh(); }} />}

      {invoices.length === 0 ? (
        <p className="py-4 text-center text-sm text-zinc-400">No invoices yet.</p>
      ) : (
        <div className="overflow-hidden rounded-lg border border-zinc-200">
          <table className="w-full text-sm">
            <thead className="border-b border-zinc-200 bg-zinc-50">
              <tr>
                {["Date", "Amount", "Status", "Notes"].map((h) => (
                  <th key={h} className="px-4 py-2.5 text-left text-[10px] font-medium uppercase tracking-wider text-zinc-500">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100">
              {invoices.map((inv) => (
                <tr key={inv.id} className="bg-white">
                  <td className="px-4 py-2.5 text-xs text-zinc-600">
                    {new Date(inv.invoice_date).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                  </td>
                  <td className="px-4 py-2.5 text-sm font-medium text-zinc-900">
                    ${Number(inv.amount).toLocaleString("en-US", { minimumFractionDigits: 2 })}
                  </td>
                  <td className="px-4 py-2.5">
                    <select
                      value={inv.status}
                      onChange={(e) => handleStatusChange(inv.id, e.target.value)}
                      className={`rounded-full border-0 px-2.5 py-0.5 text-xs font-medium focus:outline-none ${STATUS_STYLES[inv.status] || STATUS_STYLES.sent}`}
                    >
                      <option value="sent">Sent</option>
                      <option value="paid">Paid</option>
                      <option value="overdue">Overdue</option>
                    </select>
                  </td>
                  <td className="px-4 py-2.5 text-xs text-zinc-500">{inv.notes || "—"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

function AddInvoiceForm({ clientId, toast, onDone }: {
  clientId: number;
  toast: (msg: string, type: "success" | "error" | "info") => void;
  onDone: () => void;
}) {
  const today = new Date().toISOString().slice(0, 10);
  const [date, setDate] = useState(today);
  const [amount, setAmount] = useState("");
  const [status, setStatus] = useState("sent");
  const [notes, setNotes] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!amount) return;
    setLoading(true);
    const result = await createInvoice(clientId, date, parseFloat(amount), status, notes);
    if (result.success) {
      toast("Invoice added", "success");
      onDone();
    } else {
      toast(result.message, "error");
    }
    setLoading(false);
  }

  const inputClasses = "w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-900 placeholder-zinc-400 focus:border-zinc-400 focus:outline-none";

  return (
    <form onSubmit={handleSubmit} className="mb-3 rounded-lg border border-zinc-200 bg-white p-4 space-y-3">
      <div className="grid gap-3 sm:grid-cols-4">
        <input type="date" value={date} onChange={(e) => setDate(e.target.value)} className={inputClasses} />
        <input type="number" step="0.01" value={amount} onChange={(e) => setAmount(e.target.value)} placeholder="Amount *" className={inputClasses} />
        <select value={status} onChange={(e) => setStatus(e.target.value)} className={inputClasses}>
          <option value="sent">Sent</option>
          <option value="paid">Paid</option>
          <option value="overdue">Overdue</option>
        </select>
        <input value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="Notes" className={inputClasses} />
      </div>
      <button type="submit" disabled={loading || !amount} className="rounded-lg bg-zinc-900 px-4 py-2 text-xs font-semibold text-white hover:bg-zinc-800 disabled:opacity-50 transition-colors">
        {loading ? "Adding..." : "Add Invoice"}
      </button>
    </form>
  );
}
