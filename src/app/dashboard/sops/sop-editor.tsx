"use client";

import { useState } from "react";
import { createSop, updateSop } from "./actions";
import { useRouter } from "next/navigation";
import { useToast } from "../components/toast";
import { PageHeader, SectionLabel, EmptyState } from "../components/ui";
import type { Database } from "@/lib/database.types";

type Sop = Database["public"]["Tables"]["sops"]["Row"];

const SERVICE_OPTIONS = [
  { key: "invoice_ops", label: "Invoice Ops" },
  { key: "payment_followup", label: "Payment Follow-Up" },
  { key: "review_requests", label: "Review Requests" },
  { key: "weekly_summary", label: "Weekly Summary" },
  { key: "lead_intake", label: "Lead & Intake" },
];

const SERVICE_LABELS: Record<string, string> = Object.fromEntries(
  SERVICE_OPTIONS.map((s) => [s.key, s.label])
);

export function SopEditor({ sops }: { sops: Sop[] }) {
  const [showNew, setShowNew] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [expandedId, setExpandedId] = useState<number | null>(null);
  const router = useRouter();
  const { toast } = useToast();

  // Group by service_key (stored in trigger field)
  const grouped: Record<string, Sop[]> = {};
  for (const sop of sops) {
    const key = sop.trigger || "general";
    if (!grouped[key]) grouped[key] = [];
    grouped[key].push(sop);
  }

  const serviceOrder = SERVICE_OPTIONS.map((s) => s.key);
  const sortedKeys = Object.keys(grouped).sort((a, b) => {
    const ai = serviceOrder.indexOf(a);
    const bi = serviceOrder.indexOf(b);
    return (ai === -1 ? 999 : ai) - (bi === -1 ? 999 : bi);
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <PageHeader>SOPs</PageHeader>
        <button
          onClick={() => { setShowNew(!showNew); setEditingId(null); }}
          className="rounded-lg bg-zinc-900 px-5 py-2.5 text-xs font-semibold text-white hover:bg-zinc-800 transition-colors"
        >
          {showNew ? "Cancel" : "New SOP"}
        </button>
      </div>

      {showNew && (
        <SopForm
          onDone={() => { setShowNew(false); router.refresh(); }}
          toast={toast}
        />
      )}

      {sops.length === 0 && !showNew && (
        <EmptyState message="No SOPs yet. Write your first SOP as you work through client 1." />
      )}

      {sortedKeys.map((serviceKey) => (
        <div key={serviceKey}>
          <SectionLabel>{SERVICE_LABELS[serviceKey] || serviceKey}</SectionLabel>
          <div className="mt-2 space-y-2">
            {grouped[serviceKey].map((sop) => (
              <div key={sop.id} className="rounded-lg border border-zinc-200 bg-white">
                {editingId === sop.id ? (
                  <SopForm
                    sop={sop}
                    onDone={() => { setEditingId(null); router.refresh(); }}
                    toast={toast}
                  />
                ) : (
                  <>
                    <button
                      onClick={() => setExpandedId(expandedId === sop.id ? null : sop.id)}
                      className="flex w-full items-center justify-between px-4 py-3 text-left hover:bg-zinc-50 transition-colors rounded-lg"
                    >
                      <div className="flex items-center gap-3">
                        <span className="text-sm font-medium text-zinc-900">{sop.title}</span>
                      </div>
                      <div className="flex items-center gap-3 text-xs">
                        <span className="text-zinc-400">
                          {new Date(sop.created_at).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                        </span>
                        <span className="text-zinc-300">{expandedId === sop.id ? "▲" : "▼"}</span>
                      </div>
                    </button>
                    {expandedId === sop.id && (
                      <div className="border-t border-zinc-200 px-4 py-4">
                        <div className="whitespace-pre-wrap text-sm text-zinc-700 leading-relaxed">
                          {sop.steps || "No content."}
                        </div>
                        <button
                          onClick={() => { setEditingId(sop.id); setExpandedId(null); }}
                          className="mt-4 rounded-lg border border-zinc-300 bg-white px-4 py-1.5 text-xs font-semibold text-zinc-700 hover:bg-zinc-50 transition-colors"
                        >
                          Edit
                        </button>
                      </div>
                    )}
                  </>
                )}
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

function SopForm({
  sop,
  onDone,
  toast,
}: {
  sop?: Sop;
  onDone: () => void;
  toast: (msg: string, type: "success" | "error" | "info") => void;
}) {
  const [title, setTitle] = useState(sop?.title || "");
  const [serviceKey, setServiceKey] = useState(sop?.trigger || "invoice_ops");
  const [content, setContent] = useState(sop?.steps || "");
  const [loading, setLoading] = useState(false);

  const isEdit = !!sop;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!title.trim() || !content.trim()) return;
    setLoading(true);
    try {
      const result = isEdit
        ? await updateSop(sop!.id, title, content)
        : await createSop(title, serviceKey, content);
      if (result.success) {
        toast(result.message, "success");
        onDone();
      } else {
        toast(result.message, "error");
      }
    } catch (err) {
      toast(err instanceof Error ? err.message : "Failed", "error");
    } finally {
      setLoading(false);
    }
  }

  const inputClasses = "w-full rounded-lg border border-zinc-300 bg-white px-3 py-2.5 text-sm text-zinc-900 placeholder-zinc-400 focus:border-zinc-400 focus:outline-none";

  return (
    <form onSubmit={handleSubmit} className="space-y-4 rounded-lg border border-zinc-200 bg-white p-5">
      <h4 className="text-sm font-semibold text-zinc-900">{isEdit ? "Edit SOP" : "New SOP"}</h4>
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className="mb-1.5 block text-[10px] font-medium uppercase tracking-wider text-zinc-500">Title *</label>
          <input value={title} onChange={(e) => setTitle(e.target.value)} className={inputClasses} placeholder="e.g. Payment Follow-Up — First Notice" />
        </div>
        {!isEdit && (
          <div>
            <label className="mb-1.5 block text-[10px] font-medium uppercase tracking-wider text-zinc-500">Service *</label>
            <select value={serviceKey} onChange={(e) => setServiceKey(e.target.value)} className={inputClasses}>
              {SERVICE_OPTIONS.map((s) => <option key={s.key} value={s.key}>{s.label}</option>)}
            </select>
          </div>
        )}
      </div>
      <div>
        <label className="mb-1.5 block text-[10px] font-medium uppercase tracking-wider text-zinc-500">Content *</label>
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          rows={12}
          className={inputClasses}
          placeholder={"1. Check the invoice details\n2. Draft the email using this template...\n3. If the customer has not responded in 3 days, escalate to..."}
        />
      </div>
      <div className="flex items-center gap-3">
        <button
          type="submit"
          disabled={loading || !title.trim() || !content.trim()}
          className="inline-flex items-center gap-2 rounded-lg bg-zinc-900 px-5 py-2.5 text-xs font-semibold text-white hover:bg-zinc-800 disabled:opacity-50 transition-colors"
        >
          {loading && <span className="inline-block h-3 w-3 animate-spin rounded-full border-2 border-white border-t-transparent" />}
          {loading ? "Saving..." : isEdit ? "Update SOP" : "Create SOP"}
        </button>
        <button type="button" onClick={onDone} className="text-xs text-zinc-400 hover:text-zinc-700">Cancel</button>
      </div>
    </form>
  );
}
