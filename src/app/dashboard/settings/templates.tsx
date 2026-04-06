"use client";

import { useState } from "react";
import { updateTemplate, createTemplate, toggleTemplateEnabled } from "./template-actions";
import { useRouter } from "next/navigation";
import { SectionLabel } from "../components/ui";

interface Template {
  id: string;
  service_key: string;
  title: string;
  description: string | null;
  sort_order: number | null;
  requires_review: boolean | null;
  enabled?: boolean;
}

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

export function TemplateManager({
  templates,
  toast,
}: {
  templates: Template[];
  toast: (msg: string, type: "success" | "error" | "info") => void;
}) {
  const [addingFor, setAddingFor] = useState<string | null>(null);
  const router = useRouter();

  // Group by service
  const grouped: Record<string, Template[]> = {};
  for (const t of templates) {
    if (!grouped[t.service_key]) grouped[t.service_key] = [];
    grouped[t.service_key].push(t);
  }
  // Sort each group by sort_order
  for (const key of Object.keys(grouped)) {
    grouped[key].sort((a, b) => (a.sort_order ?? 0) - (b.sort_order ?? 0));
  }

  const serviceOrder = SERVICE_OPTIONS.map((s) => s.key);

  async function handleMove(templateId: string, serviceKey: string, direction: "up" | "down") {
    const group = grouped[serviceKey];
    if (!group) return;
    const idx = group.findIndex((t) => t.id === templateId);
    const swapIdx = direction === "up" ? idx - 1 : idx + 1;
    if (swapIdx < 0 || swapIdx >= group.length) return;

    const a = group[idx];
    const b = group[swapIdx];
    await Promise.all([
      updateTemplate(a.id, { sort_order: b.sort_order ?? swapIdx }),
      updateTemplate(b.id, { sort_order: a.sort_order ?? idx }),
    ]);
    router.refresh();
  }

  return (
    <section>
      <SectionLabel>Task Templates</SectionLabel>
      <div className="mt-3 space-y-6">
        {serviceOrder.map((serviceKey) => {
          const group = grouped[serviceKey] || [];
          return (
            <div key={serviceKey}>
              <div className="mb-2 flex items-center justify-between">
                <h4 className="text-xs font-semibold text-zinc-700">{SERVICE_LABELS[serviceKey] || serviceKey}</h4>
                <button
                  onClick={() => setAddingFor(addingFor === serviceKey ? null : serviceKey)}
                  className="text-[10px] font-semibold text-zinc-500 hover:text-zinc-700"
                >
                  {addingFor === serviceKey ? "Cancel" : "+ Add Template"}
                </button>
              </div>

              {addingFor === serviceKey && (
                <AddTemplateForm
                  serviceKey={serviceKey}
                  toast={toast}
                  onDone={() => { setAddingFor(null); router.refresh(); }}
                />
              )}

              {group.length === 0 && (
                <p className="text-xs text-zinc-400 py-2">No templates for this service.</p>
              )}

              <div className="space-y-1">
                {group.map((t, idx) => (
                  <TemplateRow
                    key={t.id}
                    template={t}
                    isFirst={idx === 0}
                    isLast={idx === group.length - 1}
                    onMove={(dir) => handleMove(t.id, t.service_key, dir)}
                    toast={toast}
                    onUpdate={() => router.refresh()}
                  />
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}

function TemplateRow({
  template: t,
  isFirst,
  isLast,
  onMove,
  toast,
  onUpdate,
}: {
  template: Template;
  isFirst: boolean;
  isLast: boolean;
  onMove: (dir: "up" | "down") => void;
  toast: (msg: string, type: "success" | "error" | "info") => void;
  onUpdate: () => void;
}) {
  const [editingTitle, setEditingTitle] = useState(false);
  const [editingDesc, setEditingDesc] = useState(false);
  const [title, setTitle] = useState(t.title);
  const [desc, setDesc] = useState(t.description || "");
  const enabled = (t as unknown as Record<string, unknown>).enabled !== false;

  async function saveTitle() {
    setEditingTitle(false);
    if (title === t.title) return;
    const result = await updateTemplate(t.id, { title });
    if (result.success) toast("Title updated", "success");
    else toast(result.message, "error");
    onUpdate();
  }

  async function saveDesc() {
    setEditingDesc(false);
    if (desc === (t.description || "")) return;
    const result = await updateTemplate(t.id, { description: desc });
    if (result.success) toast("Description updated", "success");
    else toast(result.message, "error");
    onUpdate();
  }

  async function handleToggle() {
    const result = await toggleTemplateEnabled(t.id, !enabled);
    if (result.success) toast(result.message, "success");
    else toast(result.message, "error");
    onUpdate();
  }

  return (
    <div className={`flex items-center gap-3 rounded-lg border bg-white px-4 py-2.5 ${enabled ? "border-zinc-200" : "border-zinc-100 opacity-50"}`}>
      {/* Reorder buttons */}
      <div className="flex flex-col gap-0.5">
        <button onClick={() => onMove("up")} disabled={isFirst} className="text-[10px] text-zinc-400 hover:text-zinc-700 disabled:opacity-20">▲</button>
        <button onClick={() => onMove("down")} disabled={isLast} className="text-[10px] text-zinc-400 hover:text-zinc-700 disabled:opacity-20">▼</button>
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        {editingTitle ? (
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            onBlur={saveTitle}
            autoFocus
            className="w-full rounded border border-zinc-300 bg-white px-2 py-0.5 text-sm font-medium text-zinc-900 focus:border-zinc-400 focus:outline-none"
          />
        ) : (
          <p className="text-sm font-medium text-zinc-900 cursor-pointer hover:text-zinc-600" onClick={() => setEditingTitle(true)}>{t.title}</p>
        )}
        {editingDesc ? (
          <input
            value={desc}
            onChange={(e) => setDesc(e.target.value)}
            onBlur={saveDesc}
            autoFocus
            className="mt-0.5 w-full rounded border border-zinc-300 bg-white px-2 py-0.5 text-xs text-zinc-600 focus:border-zinc-400 focus:outline-none"
            placeholder="Description..."
          />
        ) : (
          <p className="text-xs text-zinc-500 cursor-pointer hover:text-zinc-400 mt-0.5" onClick={() => setEditingDesc(true)}>
            {t.description || "No description — click to add"}
          </p>
        )}
      </div>

      {/* Badges */}
      <div className="flex items-center gap-2 shrink-0">
        {t.requires_review && (
          <span className="rounded-full border border-amber-200 bg-amber-50 px-2 py-0.5 text-[10px] font-medium text-amber-700">Review</span>
        )}
        <button
          onClick={handleToggle}
          className={`rounded-full border px-2 py-0.5 text-[10px] font-medium transition-colors ${
            enabled ? "border-emerald-200 bg-emerald-50 text-emerald-700" : "border-zinc-200 bg-zinc-50 text-zinc-500"
          }`}
        >
          {enabled ? "Enabled" : "Disabled"}
        </button>
      </div>
    </div>
  );
}

function AddTemplateForm({
  serviceKey,
  toast,
  onDone,
}: {
  serviceKey: string;
  toast: (msg: string, type: "success" | "error" | "info") => void;
  onDone: () => void;
}) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [requiresReview, setRequiresReview] = useState(false);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!title.trim()) return;
    setLoading(true);
    const result = await createTemplate(serviceKey, title, description, requiresReview);
    if (result.success) {
      toast("Template created", "success");
      onDone();
    } else {
      toast(result.message, "error");
    }
    setLoading(false);
  }

  const inputClasses = "w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-900 placeholder-zinc-400 focus:border-zinc-400 focus:outline-none";

  return (
    <form onSubmit={handleSubmit} className="mb-3 rounded-lg border border-zinc-200 bg-white p-4 space-y-3">
      <div className="grid gap-3 sm:grid-cols-2">
        <input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Template title *" className={inputClasses} />
        <input value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Description (optional)" className={inputClasses} />
      </div>
      <label className="flex items-center gap-2 cursor-pointer">
        <input type="checkbox" checked={requiresReview} onChange={(e) => setRequiresReview(e.target.checked)} className="h-3.5 w-3.5 accent-zinc-900" />
        <span className="text-xs text-zinc-700">Requires review</span>
      </label>
      <button type="submit" disabled={loading || !title.trim()} className="rounded-lg bg-zinc-900 px-4 py-2 text-xs font-semibold text-white hover:bg-zinc-800 disabled:opacity-50 transition-colors">
        {loading ? "Creating..." : "Add Template"}
      </button>
    </form>
  );
}
