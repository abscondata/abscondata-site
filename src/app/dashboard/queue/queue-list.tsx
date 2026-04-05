"use client";

import { useState } from "react";
import { updateTaskStatus, updateTaskDraft, createManualTask } from "./actions";
import { useRouter } from "next/navigation";
import { StatusBadge } from "../components/ui";
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

const FIELD_ORDER = [
  "customer_name", "customer_email", "customer_phone",
  "invoice_number", "amount", "due_date", "days_overdue", "notes",
];

const SERVICE_OPTIONS = [
  { key: "invoice_ops", label: "Invoice Ops" },
  { key: "payment_followup", label: "Payment Follow-Up" },
  { key: "review_requests", label: "Review Requests" },
  { key: "weekly_summary", label: "Weekly Summary" },
  { key: "lead_intake", label: "Lead & Intake" },
];

function timeAgo(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime();
  const hours = Math.floor(diff / 3600000);
  if (hours < 1) return "< 1h";
  if (hours < 24) return `${hours}h`;
  const days = Math.floor(hours / 24);
  return `${days}d`;
}

function NormalizedFields({ data }: { data: Record<string, Json | undefined> }) {
  const entries = FIELD_ORDER
    .filter((k) => data[k] && String(data[k]).trim())
    .map((k) => ({ key: k, label: FIELD_LABELS[k] || k, value: String(data[k]) }));
  if (entries.length === 0) return null;
  return (
    <div className="rounded-lg border border-zinc-200 bg-zinc-50 p-4">
      <div className="grid grid-cols-2 gap-x-8 gap-y-3 lg:grid-cols-4">
        {entries.map((e) => (
          <div key={e.key}>
            <dt className="text-[10px] font-medium uppercase tracking-wider text-zinc-500">{e.label}</dt>
            <dd className="mt-0.5 text-sm font-medium text-zinc-900">{e.value}</dd>
          </div>
        ))}
      </div>
    </div>
  );
}

function RawPayload({ data }: { data: Record<string, Json | undefined> }) {
  const entries = Object.entries(data).filter(([, v]) => v && String(v).trim());
  if (entries.length === 0) return null;
  return (
    <details className="mt-3">
      <summary className="cursor-pointer text-[10px] font-medium uppercase tracking-wider text-zinc-400 hover:text-zinc-600">
        All imported fields ({entries.length})
      </summary>
      <div className="mt-2 rounded-lg border border-zinc-100 bg-white p-3">
        <div className="grid grid-cols-2 gap-x-6 gap-y-1 lg:grid-cols-4">
          {entries.map(([k, v]) => (
            <div key={k} className="flex gap-1.5 text-xs">
              <span className="font-medium text-zinc-500">{k}:</span>
              <span className="text-zinc-900">{String(v)}</span>
            </div>
          ))}
        </div>
      </div>
    </details>
  );
}

export function QueueList({
  tasks,
  clientMap,
  sourceMap,
  clients,
  initialExpandId,
  initialFilter,
}: {
  tasks: Task[];
  clientMap: Record<number, string>;
  sourceMap: Record<number, SourceData>;
  clients: { id: number; name: string }[];
  initialExpandId?: number;
  initialFilter?: string;
}) {
  const [expandedId, setExpandedId] = useState<number | null>(initialExpandId ?? null);
  const [filter, setFilter] = useState<string>(
    initialExpandId ? "all" : (initialFilter || "all")
  );
  const [showNewTask, setShowNewTask] = useState(false);

  const filtered = filter === "all"
    ? tasks
    : tasks.filter((t) => t.status === filter);

  const statusCounts: Record<string, number> = {};
  for (const t of tasks) {
    const s = t.status || "NEW";
    statusCounts[s] = (statusCounts[s] || 0) + 1;
  }

  const tabs = [
    { key: "all", label: "All" },
    { key: "NEW", label: "New" },
    { key: "READY_FOR_REVIEW", label: "Review" },
    { key: "WAITING_ON_MISSING_DATA", label: "Waiting" },
    { key: "APPROVED", label: "Approved" },
    { key: "SENT", label: "Sent" },
    { key: "EXCEPTION", label: "Exception" },
  ];

  return (
    <div>
      <div className="mb-5 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <h2 className="text-xl font-semibold text-zinc-800">Work Queue</h2>
          <button
            onClick={() => setShowNewTask(!showNewTask)}
            className="rounded-lg bg-zinc-900 px-4 py-1.5 text-xs font-semibold text-white hover:bg-zinc-800 transition-colors"
          >
            {showNewTask ? "Cancel" : "New Task"}
          </button>
        </div>
      </div>

      {/* Filter tabs */}
      <div className="mb-5 flex border-b border-zinc-200">
        {tabs.map((t) => {
          const count = t.key === "all" ? tasks.length : (statusCounts[t.key] || 0);
          const active = filter === t.key;
          return (
            <button
              key={t.key}
              onClick={() => setFilter(t.key)}
              className={`relative px-4 py-2.5 text-xs font-medium transition-colors ${
                active ? "text-zinc-800" : "text-zinc-400 hover:text-zinc-600"
              }`}
            >
              {t.label}{count > 0 ? ` (${count})` : ""}
              {active && <span className="absolute bottom-0 left-4 right-4 h-[2px] bg-zinc-800" />}
            </button>
          );
        })}
      </div>

      {showNewTask && <NewTaskForm clients={clients} onDone={() => setShowNewTask(false)} />}

      {filtered.length === 0 && (
        <p className="py-12 text-center text-sm text-zinc-400">
          {filter === "all" ? "Queue is empty. All caught up." : `No ${filter.toLowerCase().replace(/_/g, " ")} tasks.`}
        </p>
      )}

      <div className="space-y-1.5">
        {filtered.map((task) => (
          <TaskRow
            key={task.id}
            task={task}
            clientName={task.client_id ? clientMap[task.client_id] || "Unknown" : ""}
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
  const [editedDraft, setEditedDraft] = useState(task.edited_draft || "");
  const [rejectReason, setRejectReason] = useState("");
  const [showReject, setShowReject] = useState(false);
  const [needsInfoNotes, setNeedsInfoNotes] = useState("");
  const [showNeedsInfo, setShowNeedsInfo] = useState(false);
  const router = useRouter();

  const normalized = (sourceData?.normalized_fields_json as Record<string, Json | undefined>) || {};
  const payload = (sourceData?.payload_json as Record<string, Json | undefined>) || {};
  const status = task.status || "NEW";
  const isReviewable = status === "READY_FOR_REVIEW";
  const age = task.created_at ? timeAgo(task.created_at) : "";

  async function handleAction(
    newStatus: string,
    extra?: { rejection_reason?: string; notes?: string }
  ) {
    setLoading(true);
    try {
      await updateTaskStatus(task.id, newStatus as Parameters<typeof updateTaskStatus>[1], {
        ...extra,
        edited_draft: editedDraft,
      });
      setShowReject(false);
      setShowNeedsInfo(false);
      setRejectReason("");
      setNeedsInfoNotes("");
      router.refresh();
    } catch (err) {
      alert(err instanceof Error ? err.message : "Failed");
    } finally {
      setLoading(false);
    }
  }

  async function saveDraft() {
    try {
      await updateTaskDraft(task.id, editedDraft, "edited_draft");
    } catch {
      // silent
    }
  }

  return (
    <div className={`rounded-lg border bg-white ${expanded ? "border-zinc-300 shadow-sm" : "border-zinc-200"}`}>
      {/* Collapsed header */}
      <button onClick={onToggle} className="flex w-full items-center justify-between px-4 py-3 text-left hover:bg-zinc-50 transition-colors rounded-lg">
        <div className="flex items-center gap-3 min-w-0">
          <StatusBadge status={status} />
          <span className="font-medium text-zinc-700 text-xs shrink-0">{clientName}</span>
          <span className="truncate text-sm text-zinc-900">{task.title || "Untitled task"}</span>
        </div>
        <div className="flex shrink-0 items-center gap-3 text-xs">
          <span className="text-zinc-400">{age}</span>
          <span className="text-zinc-300">{expanded ? "▲" : "▼"}</span>
        </div>
      </button>

      {/* Expanded workspace */}
      {expanded && (
        <div className="border-t border-zinc-200">
          <div className="grid md:grid-cols-[3fr_2fr]">
            {/* Left column: working area */}
            <div className="space-y-5 p-5 md:border-r md:border-zinc-100">
              {/* Source data */}
              {Object.keys(normalized).some((k) => normalized[k] && String(normalized[k]).trim()) && (
                <div>
                  <NormalizedFields data={normalized} />
                  <RawPayload data={payload} />
                </div>
              )}

              {/* Task description */}
              {task.notes && (
                <div>
                  <label className="mb-1.5 block text-[10px] font-medium uppercase tracking-wider text-zinc-500">Task Description</label>
                  <p className="text-sm text-zinc-700">{task.notes}</p>
                </div>
              )}

              {/* Exception/rejection */}
              {(task.rejection_reason || task.exception_description) && (
                <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3">
                  <span className="text-[10px] font-semibold uppercase tracking-wider text-red-500">
                    {status === "EXCEPTION" ? "Exception" : "Previously Rejected"}
                  </span>
                  <p className="mt-1 text-sm font-medium text-red-800">{task.exception_description || task.rejection_reason}</p>
                </div>
              )}

              {/* Draft area */}
              <div className="grid gap-4 lg:grid-cols-2">
                <div>
                  <label className="mb-1.5 block text-[10px] font-medium uppercase tracking-wider text-zinc-500">
                    AI Draft <span className="font-normal normal-case tracking-normal text-zinc-400">(read-only)</span>
                  </label>
                  <textarea
                    value={task.ai_draft || ""}
                    readOnly
                    rows={6}
                    className="w-full rounded-lg border border-zinc-200 bg-zinc-50 px-3 py-2.5 text-sm text-zinc-700 cursor-default"
                    placeholder="No AI draft yet"
                  />
                </div>
                <div>
                  <label className="mb-1.5 block text-[10px] font-medium uppercase tracking-wider text-zinc-500">
                    Final Draft <span className="font-normal normal-case tracking-normal text-zinc-400">{isReviewable ? "(editable)" : "(locked)"}</span>
                  </label>
                  <textarea
                    value={editedDraft}
                    onChange={isReviewable ? (e) => setEditedDraft(e.target.value) : undefined}
                    onBlur={isReviewable ? saveDraft : undefined}
                    readOnly={!isReviewable}
                    rows={6}
                    className={`w-full rounded-lg border px-3 py-2.5 text-sm ${
                      isReviewable
                        ? "border-zinc-300 bg-white text-zinc-900 placeholder-zinc-400 focus:border-zinc-400 focus:outline-none"
                        : "border-zinc-200 bg-zinc-50 text-zinc-700 cursor-default"
                    }`}
                    placeholder={isReviewable ? "Edit the final version here..." : "No draft yet"}
                  />
                </div>
              </div>

              {/* Actions */}
              <div className="flex flex-wrap items-center gap-3 border-t border-zinc-200 pt-4">
                {status === "NEW" && (
                  <>
                    <button onClick={() => handleAction("READY_FOR_REVIEW")} disabled={loading} className="rounded-lg bg-zinc-900 px-5 py-2.5 text-xs font-semibold text-white hover:bg-zinc-800 disabled:opacity-50 transition-colors">Start Working</button>
                    <button onClick={() => setShowNeedsInfo(!showNeedsInfo)} disabled={loading} className="rounded-lg border border-zinc-300 bg-white px-5 py-2.5 text-xs font-semibold text-zinc-700 hover:bg-zinc-50 disabled:opacity-50 transition-colors">Needs Info</button>
                  </>
                )}
                {status === "WAITING_ON_MISSING_DATA" && (
                  <button onClick={() => handleAction("READY_FOR_REVIEW")} disabled={loading} className="rounded-lg bg-zinc-900 px-5 py-2.5 text-xs font-semibold text-white hover:bg-zinc-800 disabled:opacity-50 transition-colors">Ready for Review</button>
                )}
                {status === "READY_FOR_REVIEW" && (
                  <>
                    <button onClick={() => handleAction("APPROVED")} disabled={loading} className="rounded-lg bg-emerald-600 px-5 py-2.5 text-xs font-semibold text-white hover:bg-emerald-700 disabled:opacity-50 transition-colors">Approve</button>
                    <button onClick={() => setShowReject(!showReject)} disabled={loading} className="rounded-lg border border-zinc-300 bg-white px-5 py-2.5 text-xs font-semibold text-zinc-700 hover:bg-zinc-50 disabled:opacity-50 transition-colors">Reject</button>
                  </>
                )}
                {status === "APPROVED" && (
                  <button onClick={() => handleAction("SENT")} disabled={loading} className="rounded-lg bg-blue-600 px-5 py-2.5 text-xs font-semibold text-white hover:bg-blue-700 disabled:opacity-50 transition-colors">Mark Sent</button>
                )}
                {status === "SENT" && (
                  <button onClick={() => handleAction("CLOSED")} disabled={loading} className="rounded-lg border border-zinc-300 bg-white px-5 py-2.5 text-xs font-semibold text-zinc-700 hover:bg-zinc-50 disabled:opacity-50 transition-colors">Close Task</button>
                )}
              </div>

              {showNeedsInfo && (
                <div className="flex items-end gap-3 rounded-lg border border-zinc-200 bg-zinc-50 p-4">
                  <div className="flex-1">
                    <label className="mb-1.5 block text-[10px] font-medium uppercase tracking-wider text-zinc-500">What information is needed?</label>
                    <input value={needsInfoNotes} onChange={(e) => setNeedsInfoNotes(e.target.value)} className="w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-900 placeholder-zinc-400 focus:border-zinc-400 focus:outline-none" placeholder="Describe what is missing..." />
                  </div>
                  <button onClick={() => handleAction("WAITING_ON_MISSING_DATA", { notes: needsInfoNotes })} disabled={loading || !needsInfoNotes} className="rounded-lg bg-orange-600 px-5 py-2.5 text-xs font-semibold text-white hover:bg-orange-700 disabled:opacity-50 transition-colors">Mark Waiting</button>
                </div>
              )}

              {showReject && (
                <div className="flex items-end gap-3 rounded-lg border border-zinc-200 bg-zinc-50 p-4">
                  <div className="flex-1">
                    <label className="mb-1.5 block text-[10px] font-medium uppercase tracking-wider text-zinc-500">Rejection reason</label>
                    <input value={rejectReason} onChange={(e) => setRejectReason(e.target.value)} className="w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-900 placeholder-zinc-400 focus:border-zinc-400 focus:outline-none" placeholder="Why is this being rejected?" />
                  </div>
                  <button onClick={() => handleAction("EXCEPTION", { rejection_reason: rejectReason })} disabled={loading || !rejectReason} className="rounded-lg bg-red-600 px-5 py-2.5 text-xs font-semibold text-white hover:bg-red-700 disabled:opacity-50 transition-colors">Confirm Reject</button>
                </div>
              )}
            </div>

            {/* Right column: metadata */}
            <div className="space-y-5 p-5 bg-zinc-50/50">
              {/* Recipient */}
              {(task.recipient_name || task.recipient_email) && (
                <div>
                  <label className="mb-2 block text-[10px] font-medium uppercase tracking-wider text-zinc-500">Recipient</label>
                  <div className="space-y-1 text-sm">
                    {task.recipient_name && <p className="font-medium text-zinc-900">{task.recipient_name}</p>}
                    {task.recipient_email && <p className="text-zinc-600">{task.recipient_email}</p>}
                  </div>
                </div>
              )}

              {/* Subject line */}
              {(task.service_key === "payment_followup" || task.service_key === "review_requests") && (
                <div>
                  <label className="mb-1 block text-[10px] font-medium uppercase tracking-wider text-zinc-500">Subject Line</label>
                  <p className="text-sm text-zinc-900">{task.subject_line || "Not set"}</p>
                </div>
              )}

              {/* Metadata */}
              <div>
                <label className="mb-2 block text-[10px] font-medium uppercase tracking-wider text-zinc-500">Details</label>
                <div className="space-y-1.5 text-xs text-zinc-600">
                  <div className="flex justify-between"><span className="text-zinc-500">Service</span><span>{SERVICE_LABELS[task.service_key || ""] || "Not set"}</span></div>
                  <div className="flex justify-between"><span className="text-zinc-500">Source</span><span>{task.source_system || "manual"}</span></div>
                  {task.created_at && <div className="flex justify-between"><span className="text-zinc-500">Created</span><span>{new Date(task.created_at).toLocaleDateString()}</span></div>}
                  {task.updated_at && <div className="flex justify-between"><span className="text-zinc-500">Updated</span><span>{new Date(task.updated_at).toLocaleDateString()}</span></div>}
                  {task.approved_at && <div className="flex justify-between"><span className="text-zinc-500">Approved</span><span>{new Date(task.approved_at).toLocaleDateString()}</span></div>}
                  {task.sent_at && <div className="flex justify-between"><span className="text-zinc-500">Sent</span><span>{new Date(task.sent_at).toLocaleDateString()}</span></div>}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function NewTaskForm({ clients, onDone }: { clients: { id: number; name: string }[]; onDone: () => void }) {
  const [loading, setLoading] = useState(false);
  const [clientId, setClientId] = useState("");
  const [serviceKey, setServiceKey] = useState("payment_followup");
  const [title, setTitle] = useState("");
  const [recipientName, setRecipientName] = useState("");
  const [recipientEmail, setRecipientEmail] = useState("");
  const [recipientPhone, setRecipientPhone] = useState("");
  const [sourceNotes, setSourceNotes] = useState("");
  const router = useRouter();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!clientId || !title) return;
    setLoading(true);
    try {
      await createManualTask(Number(clientId), serviceKey, { name: recipientName, email: recipientEmail, phone: recipientPhone }, sourceNotes, title);
      onDone();
      router.refresh();
    } catch (err) {
      alert(err instanceof Error ? err.message : "Failed to create task");
    } finally {
      setLoading(false);
    }
  }

  const inputClasses = "w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-900 placeholder-zinc-400 focus:border-zinc-400 focus:outline-none";

  return (
    <form onSubmit={handleSubmit} className="mb-5 rounded-lg border border-zinc-200 bg-white p-5 space-y-4">
      <h3 className="text-sm font-semibold text-zinc-900">Create Task</h3>
      <div className="grid gap-4 sm:grid-cols-3">
        <div>
          <label className="mb-1.5 block text-[10px] font-medium uppercase tracking-wider text-zinc-500">Client *</label>
          <select value={clientId} onChange={(e) => setClientId(e.target.value)} required className={inputClasses}>
            <option value="">Select client...</option>
            {clients.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
          </select>
        </div>
        <div>
          <label className="mb-1.5 block text-[10px] font-medium uppercase tracking-wider text-zinc-500">Service *</label>
          <select value={serviceKey} onChange={(e) => setServiceKey(e.target.value)} className={inputClasses}>
            {SERVICE_OPTIONS.map((s) => <option key={s.key} value={s.key}>{s.label}</option>)}
          </select>
        </div>
        <div>
          <label className="mb-1.5 block text-[10px] font-medium uppercase tracking-wider text-zinc-500">Task Title *</label>
          <input value={title} onChange={(e) => setTitle(e.target.value)} required placeholder="e.g. Follow up: John Smith INV-1234" className={inputClasses} />
        </div>
      </div>
      <div className="grid gap-4 sm:grid-cols-3">
        <div>
          <label className="mb-1.5 block text-[10px] font-medium uppercase tracking-wider text-zinc-500">Recipient Name</label>
          <input value={recipientName} onChange={(e) => setRecipientName(e.target.value)} placeholder="Customer name" className={inputClasses} />
        </div>
        <div>
          <label className="mb-1.5 block text-[10px] font-medium uppercase tracking-wider text-zinc-500">Recipient Email</label>
          <input value={recipientEmail} onChange={(e) => setRecipientEmail(e.target.value)} placeholder="customer@example.com" className={inputClasses} />
        </div>
        <div>
          <label className="mb-1.5 block text-[10px] font-medium uppercase tracking-wider text-zinc-500">Recipient Phone</label>
          <input value={recipientPhone} onChange={(e) => setRecipientPhone(e.target.value)} placeholder="555-555-5555" className={inputClasses} />
        </div>
      </div>
      <div>
        <label className="mb-1.5 block text-[10px] font-medium uppercase tracking-wider text-zinc-500">Source Notes</label>
        <textarea value={sourceNotes} onChange={(e) => setSourceNotes(e.target.value)} rows={3} placeholder="Invoice details, amounts, dates, context..." className={inputClasses} />
      </div>
      <button type="submit" disabled={loading || !clientId || !title} className="rounded-lg bg-zinc-900 px-5 py-2.5 text-xs font-semibold text-white hover:bg-zinc-800 disabled:opacity-50 transition-colors">
        {loading ? "Creating..." : "Create Task"}
      </button>
    </form>
  );
}
