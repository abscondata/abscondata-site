"use client";

import { useState } from "react";
import { updateTaskStatus, updateTaskDraft } from "./actions";
import { useRouter } from "next/navigation";
import type { Database, Json } from "@/lib/database.types";

type Task = Database["public"]["Tables"]["tasks"]["Row"];
type SourceData = Database["public"]["Tables"]["task_source_data"]["Row"];

const SERVICE_LABELS: Record<string, string> = {
  invoice_ops: "Invoice Ops",
  payment_followup: "Payment Follow-Up",
  review_requests: "Review Requests",
  weekly_summary: "Weekly Summary",
  lead_intake: "Lead & Intake",
};

const STATUS_COLORS: Record<string, string> = {
  NEW: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
  READY_FOR_REVIEW: "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400",
  WAITING_ON_MISSING_DATA: "bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400",
  APPROVED: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
  SENT: "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400",
};

const FIELD_LABELS: Record<string, string> = {
  customer_name: "Customer",
  customer_email: "Email",
  customer_phone: "Phone",
  invoice_number: "Invoice #",
  amount: "Amount",
  due_date: "Due Date",
  days_overdue: "Days Overdue",
  notes: "Notes",
};

// Order for displaying normalized fields
const FIELD_ORDER = [
  "customer_name", "customer_email", "customer_phone",
  "invoice_number", "amount", "due_date", "days_overdue", "notes",
];

function NormalizedFields({ data }: { data: Record<string, Json | undefined> }) {
  const entries = FIELD_ORDER
    .filter((k) => data[k] && String(data[k]).trim())
    .map((k) => ({ key: k, label: FIELD_LABELS[k] || k, value: String(data[k]) }));

  if (entries.length === 0) return null;

  return (
    <div className="grid grid-cols-2 gap-x-6 gap-y-2 lg:grid-cols-4">
      {entries.map((e) => (
        <div key={e.key}>
          <dt className="text-[10px] font-medium uppercase tracking-wider text-zinc-400">{e.label}</dt>
          <dd className="mt-0.5 text-sm text-zinc-900 dark:text-zinc-100">{e.value}</dd>
        </div>
      ))}
    </div>
  );
}

function RawPayload({ data }: { data: Record<string, Json | undefined> }) {
  const entries = Object.entries(data).filter(([, v]) => v && String(v).trim());
  if (entries.length === 0) return null;

  return (
    <details className="mt-2">
      <summary className="cursor-pointer text-[10px] font-medium uppercase tracking-wider text-zinc-400 hover:text-zinc-600">
        All imported fields ({entries.length})
      </summary>
      <div className="mt-2 grid grid-cols-2 gap-x-6 gap-y-1 lg:grid-cols-4">
        {entries.map(([k, v]) => (
          <div key={k} className="flex gap-1 text-xs">
            <span className="font-medium text-zinc-500">{k}:</span>
            <span className="text-zinc-700 dark:text-zinc-300">{String(v)}</span>
          </div>
        ))}
      </div>
    </details>
  );
}

export function QueueList({
  tasks,
  clientMap,
  sourceMap,
}: {
  tasks: Task[];
  clientMap: Record<number, string>;
  sourceMap: Record<number, SourceData>;
}) {
  const [expandedId, setExpandedId] = useState<number | null>(null);
  const [filter, setFilter] = useState<string>("all");

  const filtered = filter === "all"
    ? tasks
    : tasks.filter((t) => t.status === filter);

  const statusCounts: Record<string, number> = {};
  for (const t of tasks) {
    const s = t.status || "NEW";
    statusCounts[s] = (statusCounts[s] || 0) + 1;
  }

  return (
    <div>
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100">Work Queue</h2>
        <div className="flex items-center gap-1">
          {[
            { key: "all", label: "All" },
            { key: "NEW", label: "New" },
            { key: "READY_FOR_REVIEW", label: "Review" },
            { key: "APPROVED", label: "Approved" },
            { key: "SENT", label: "Sent" },
          ].map((f) => (
            <button
              key={f.key}
              onClick={() => setFilter(f.key)}
              className={`rounded-md px-2.5 py-1 text-xs font-medium transition-colors ${
                filter === f.key
                  ? "bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900"
                  : "text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100"
              }`}
            >
              {f.label}
              {f.key !== "all" && statusCounts[f.key] ? ` (${statusCounts[f.key]})` : ""}
              {f.key === "all" ? ` (${tasks.length})` : ""}
            </button>
          ))}
        </div>
      </div>

      {filtered.length === 0 && (
        <p className="py-12 text-center text-sm text-zinc-500 dark:text-zinc-400">
          {filter === "all" ? "Queue is empty. All caught up." : `No ${filter.toLowerCase().replace(/_/g, " ")} tasks.`}
        </p>
      )}

      <div className="space-y-2">
        {filtered.map((task) => (
          <TaskRow
            key={task.id}
            task={task}
            clientName={task.client_id ? clientMap[task.client_id] || "Unknown" : "—"}
            sourceData={task.id ? sourceMap[task.id] : undefined}
            expanded={expandedId === task.id}
            onToggle={() => setExpandedId(expandedId === task.id ? null : task.id)}
          />
        ))}
      </div>
    </div>
  );
}

function TaskRow({
  task,
  clientName,
  sourceData,
  expanded,
  onToggle,
}: {
  task: Task;
  clientName: string;
  sourceData?: SourceData;
  expanded: boolean;
  onToggle: () => void;
}) {
  const [loading, setLoading] = useState(false);
  const [aiDraft, setAiDraft] = useState(task.ai_draft || "");
  const [editedDraft, setEditedDraft] = useState(task.edited_draft || "");
  const [rejectReason, setRejectReason] = useState("");
  const [showReject, setShowReject] = useState(false);
  const router = useRouter();

  const normalized = (sourceData?.normalized_fields_json as Record<string, Json | undefined>) || {};
  const payload = (sourceData?.payload_json as Record<string, Json | undefined>) || {};

  async function handleAction(
    status: "READY_FOR_REVIEW" | "APPROVED" | "SENT" | "CLOSED" | "NEW",
    extra?: { rejection_reason?: string }
  ) {
    setLoading(true);
    try {
      await updateTaskStatus(task.id, status, {
        ...extra,
        ai_draft: aiDraft,
        edited_draft: editedDraft,
      });
      setShowReject(false);
      setRejectReason("");
      router.refresh();
    } catch (err) {
      alert(err instanceof Error ? err.message : "Failed");
    } finally {
      setLoading(false);
    }
  }

  async function saveDraft(field: "ai_draft" | "edited_draft", value: string) {
    try {
      await updateTaskDraft(task.id, value, field);
    } catch {
      // silent
    }
  }

  return (
    <div className="rounded-lg border border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-900">
      {/* Collapsed header */}
      <button onClick={onToggle} className="flex w-full items-center justify-between px-4 py-3 text-left">
        <div className="flex items-center gap-3 min-w-0">
          <span className={`shrink-0 rounded-full px-2 py-0.5 text-[10px] font-medium ${STATUS_COLORS[task.status || "NEW"] || STATUS_COLORS.NEW}`}>
            {task.status}
          </span>
          <span className="truncate text-sm font-medium text-zinc-900 dark:text-zinc-100">{task.title}</span>
        </div>
        <div className="flex shrink-0 items-center gap-3 text-xs text-zinc-500 dark:text-zinc-400">
          <span className="font-medium">{clientName}</span>
          <span>{SERVICE_LABELS[task.service_key || ""] || task.service_key || ""}</span>
          {task.due_at && <span>{new Date(task.due_at).toLocaleDateString("en-US", { month: "short", day: "numeric" })}</span>}
          <span className="text-zinc-300 dark:text-zinc-600">{expanded ? "▲" : "▼"}</span>
        </div>
      </button>

      {/* Expanded workspace */}
      {expanded && (
        <div className="border-t border-zinc-100 dark:border-zinc-800">
          {/* Context bar */}
          <div className="flex items-center gap-4 border-b border-zinc-100 bg-zinc-50 px-4 py-2 text-xs dark:border-zinc-800 dark:bg-zinc-900/50">
            <span className="font-medium text-zinc-700 dark:text-zinc-300">{clientName}</span>
            <span className="text-zinc-400">·</span>
            <span className="text-zinc-500">{SERVICE_LABELS[task.service_key || ""] || task.service_key}</span>
            {task.recipient_name && (
              <>
                <span className="text-zinc-400">·</span>
                <span className="text-zinc-500">To: {task.recipient_name}</span>
              </>
            )}
            {task.recipient_email && (
              <span className="text-zinc-400">&lt;{task.recipient_email}&gt;</span>
            )}
            {task.source_system === "csv_import" && (
              <span className="rounded bg-zinc-200 px-1.5 py-0.5 text-[10px] font-medium text-zinc-600 dark:bg-zinc-700 dark:text-zinc-400">CSV Import</span>
            )}
          </div>

          <div className="space-y-4 px-4 py-4">
            {/* Source data — normalized fields */}
            {Object.keys(normalized).some((k) => normalized[k] && String(normalized[k]).trim()) && (
              <div>
                <NormalizedFields data={normalized} />
                <RawPayload data={payload} />
              </div>
            )}

            {/* Task description */}
            {task.notes && (
              <div>
                <label className="mb-1 block text-[10px] font-medium uppercase tracking-wider text-zinc-400">Task Description</label>
                <p className="text-sm text-zinc-700 dark:text-zinc-300">{task.notes}</p>
              </div>
            )}

            {/* Rejection info */}
            {task.rejection_reason && (
              <div className="rounded-md border border-red-200 bg-red-50 px-3 py-2 dark:border-red-800 dark:bg-red-900/20">
                <span className="text-[10px] font-medium uppercase tracking-wider text-red-400">Previously Rejected</span>
                <p className="mt-0.5 text-sm text-red-700 dark:text-red-400">{task.rejection_reason}</p>
              </div>
            )}

            {/* Draft area */}
            <div className="grid gap-4 lg:grid-cols-2">
              <div>
                <label className="mb-1 block text-[10px] font-medium uppercase tracking-wider text-zinc-400">
                  AI Draft
                  <span className="ml-1 font-normal normal-case tracking-normal text-zinc-300">(auto-generated or paste here)</span>
                </label>
                <textarea
                  value={aiDraft}
                  onChange={(e) => setAiDraft(e.target.value)}
                  onBlur={() => saveDraft("ai_draft", aiDraft)}
                  rows={8}
                  className="w-full rounded-md border border-zinc-200 bg-zinc-50 px-3 py-2 text-sm text-zinc-900 focus:border-zinc-400 focus:outline-none dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-100"
                  placeholder="Draft email, message, or notes..."
                />
              </div>
              <div>
                <label className="mb-1 block text-[10px] font-medium uppercase tracking-wider text-zinc-400">
                  Final Draft
                  <span className="ml-1 font-normal normal-case tracking-normal text-zinc-300">(edit before approving)</span>
                </label>
                <textarea
                  value={editedDraft}
                  onChange={(e) => setEditedDraft(e.target.value)}
                  onBlur={() => saveDraft("edited_draft", editedDraft)}
                  rows={8}
                  className="w-full rounded-md border border-zinc-200 bg-white px-3 py-2 text-sm text-zinc-900 focus:border-zinc-400 focus:outline-none dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-100"
                  placeholder="Final version — what actually gets sent..."
                />
              </div>
            </div>

            {/* Subject line (for email tasks) */}
            {(task.service_key === "payment_followup" || task.service_key === "review_requests") && (
              <div>
                <label className="mb-1 block text-[10px] font-medium uppercase tracking-wider text-zinc-400">Subject Line</label>
                <p className="text-sm text-zinc-700 dark:text-zinc-300">{task.subject_line || "—"}</p>
              </div>
            )}

            {/* Timestamps */}
            <div className="flex flex-wrap gap-4 text-[10px] text-zinc-400">
              {task.created_at && <span>Created: {new Date(task.created_at).toLocaleString()}</span>}
              {task.approved_at && <span>Approved: {new Date(task.approved_at).toLocaleString()}</span>}
              {task.sent_at && <span>Sent: {new Date(task.sent_at).toLocaleString()}</span>}
              {task.updated_at && <span>Updated: {new Date(task.updated_at).toLocaleString()}</span>}
            </div>

            {/* Action buttons */}
            <div className="flex flex-wrap items-center gap-2 border-t border-zinc-100 pt-3 dark:border-zinc-800">
              {task.status === "NEW" && (
                <button
                  onClick={() => handleAction("READY_FOR_REVIEW")}
                  disabled={loading}
                  className="rounded-md bg-zinc-900 px-4 py-2 text-xs font-medium text-white hover:bg-zinc-800 disabled:opacity-50 dark:bg-zinc-100 dark:text-zinc-900"
                >
                  Start Working
                </button>
              )}
              {task.status === "READY_FOR_REVIEW" && (
                <>
                  <button
                    onClick={() => handleAction("APPROVED")}
                    disabled={loading}
                    className="rounded-md bg-green-700 px-4 py-2 text-xs font-medium text-white hover:bg-green-600 disabled:opacity-50"
                  >
                    Approve
                  </button>
                  <button
                    onClick={() => setShowReject(!showReject)}
                    disabled={loading}
                    className="rounded-md bg-zinc-200 px-4 py-2 text-xs font-medium text-zinc-700 hover:bg-zinc-300 disabled:opacity-50 dark:bg-zinc-700 dark:text-zinc-200"
                  >
                    Reject
                  </button>
                </>
              )}
              {task.status === "APPROVED" && (
                <button
                  onClick={() => handleAction("SENT")}
                  disabled={loading}
                  className="rounded-md bg-blue-700 px-4 py-2 text-xs font-medium text-white hover:bg-blue-600 disabled:opacity-50"
                >
                  Mark Sent
                </button>
              )}
              {task.status === "SENT" && (
                <button
                  onClick={() => handleAction("CLOSED")}
                  disabled={loading}
                  className="rounded-md bg-zinc-600 px-4 py-2 text-xs font-medium text-white hover:bg-zinc-500 disabled:opacity-50"
                >
                  Close Task
                </button>
              )}
              {task.status === "WAITING_ON_MISSING_DATA" && (
                <button
                  onClick={() => handleAction("READY_FOR_REVIEW")}
                  disabled={loading}
                  className="rounded-md bg-zinc-900 px-4 py-2 text-xs font-medium text-white hover:bg-zinc-800 disabled:opacity-50 dark:bg-zinc-100 dark:text-zinc-900"
                >
                  Data Received → Review
                </button>
              )}
            </div>

            {/* Reject reason input */}
            {showReject && (
              <div className="flex items-end gap-2">
                <div className="flex-1">
                  <label className="mb-1 block text-xs text-zinc-500">Rejection reason</label>
                  <input
                    value={rejectReason}
                    onChange={(e) => setRejectReason(e.target.value)}
                    className="w-full rounded-md border border-zinc-200 px-3 py-1.5 text-sm dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-100"
                    placeholder="Why is this being sent back?"
                  />
                </div>
                <button
                  onClick={() => handleAction("NEW", { rejection_reason: rejectReason })}
                  disabled={loading || !rejectReason}
                  className="rounded-md bg-red-700 px-4 py-2 text-xs font-medium text-white hover:bg-red-600 disabled:opacity-50"
                >
                  Confirm Reject
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
