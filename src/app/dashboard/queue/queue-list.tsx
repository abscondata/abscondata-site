"use client";

import { useState, useEffect, useRef } from "react";
import { updateTaskStatus, updateTaskDraft, createManualTask, retryException, closeException } from "./actions";
import { generateAiDraft } from "./ai-draft";
import { useRouter } from "next/navigation";
import { StatusBadge, EmptyState } from "../components/ui";
import { useToast } from "../components/toast";
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

function ageHours(dateStr: string): number {
  return (Date.now() - new Date(dateStr).getTime()) / 3600000;
}

const TERMINAL_STATUSES = ["SENT", "CLOSED"];

const DATE_FIELDS = ["due_date", "date_due", "invoice_date"];
const AMOUNT_FIELDS = ["amount", "balance", "total", "amount_due"];

function formatFieldValue(key: string, value: string): string {
  if (AMOUNT_FIELDS.includes(key)) {
    const num = parseFloat(value.replace(/[^0-9.-]/g, ""));
    if (!isNaN(num)) return `$${num.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  }
  if (DATE_FIELDS.includes(key)) {
    const d = new Date(value);
    if (!isNaN(d.getTime())) return d.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
  }
  return value;
}

function StructuredSourceData({ normalized, payload }: { normalized: Record<string, Json | undefined>; payload: Record<string, Json | undefined> }) {
  const normalizedEntries = FIELD_ORDER
    .filter((k) => normalized[k] && String(normalized[k]).trim())
    .map((k) => ({ key: k, label: FIELD_LABELS[k] || k.replace(/_/g, " "), value: formatFieldValue(k, String(normalized[k])) }));

  const payloadEntries = Object.entries(payload).filter(([, v]) => v && String(v).trim());

  if (normalizedEntries.length === 0 && payloadEntries.length === 0) return null;

  return (
    <div>
      {normalizedEntries.length > 0 ? (
        <div className="rounded-lg border border-zinc-200 bg-zinc-50 p-4">
          <div className="space-y-2">
            {normalizedEntries.map((e) => (
              <div key={e.key} className="flex items-baseline justify-between gap-4">
                <span className="text-[10px] font-medium uppercase tracking-wider text-zinc-500 shrink-0">{e.label}</span>
                <span className="text-sm font-medium text-zinc-900 text-right">{e.value}</span>
              </div>
            ))}
          </div>
        </div>
      ) : (
        // Fallback: formatted payload JSON
        <pre className="rounded-lg border border-zinc-200 bg-zinc-50 p-4 text-xs text-zinc-700 overflow-x-auto whitespace-pre-wrap font-mono">
          {JSON.stringify(payload, null, 2)}
        </pre>
      )}

      {/* Raw data collapsible */}
      {payloadEntries.length > 0 && normalizedEntries.length > 0 && (
        <details className="mt-3">
          <summary className="cursor-pointer text-[10px] font-medium uppercase tracking-wider text-zinc-400 hover:text-zinc-600">
            Raw Data ({payloadEntries.length} fields)
          </summary>
          <div className="mt-2 rounded-lg border border-zinc-100 bg-white p-3">
            <div className="grid grid-cols-2 gap-x-6 gap-y-1 lg:grid-cols-4">
              {payloadEntries.map(([k, v]) => (
                <div key={k} className="flex gap-1.5 text-xs">
                  <span className="font-medium text-zinc-500">{k}:</span>
                  <span className="text-zinc-900">{String(v)}</span>
                </div>
              ))}
            </div>
          </div>
        </details>
      )}
    </div>
  );
}

interface TaskTemplate {
  id: string;
  service_key: string;
  title: string;
  description: string | null;
}

export function QueueList({
  tasks,
  clientMap,
  sourceMap,
  clients,
  templates,
  role = "owner",
  isFirstSession = false,
  initialExpandId,
  initialFilter,
  initialNewTaskClientId,
}: {
  tasks: Task[];
  clientMap: Record<number, string>;
  sourceMap: Record<number, SourceData>;
  clients: { id: number; name: string }[];
  templates: TaskTemplate[];
  role?: "owner" | "va";
  isFirstSession?: boolean;
  initialExpandId?: number;
  initialFilter?: string;
  initialNewTaskClientId?: string;
}) {
  const isOwner = role === "owner";
  const [expandedId, setExpandedId] = useState<number | null>(initialExpandId ?? null);
  const [filter, setFilter] = useState<string>(
    initialExpandId ? "all" : (initialFilter || "all")
  );
  const [showNewTask, setShowNewTask] = useState(isOwner && !!initialNewTaskClientId);
  const [selectedIds, setSelectedIds] = useState<Set<number>>(new Set());
  const [batchLoading, setBatchLoading] = useState(false);
  const [search, setSearch] = useState("");
  const router = useRouter();
  const { toast } = useToast();

  const overdueThresholdMs = 48 * 3600000;
  const overdueTasks = tasks.filter(
    (t) => t.created_at && !TERMINAL_STATUSES.includes(t.status || "NEW") && (Date.now() - new Date(t.created_at).getTime()) > overdueThresholdMs
  );

  const statusFiltered = filter === "all"
    ? tasks
    : filter === "OVERDUE"
    ? overdueTasks
    : tasks.filter((t) => t.status === filter);

  // Search filter (client-side)
  const searchLower = search.toLowerCase();
  const filtered = search
    ? statusFiltered.filter((t) => {
        const title = (t.title || "").toLowerCase();
        const recipient = (t.recipient_name || "").toLowerCase();
        const recipientEmail = (t.recipient_email || "").toLowerCase();
        const client = (t.client_id ? clientMap[t.client_id] || "" : "").toLowerCase();
        return title.includes(searchLower) || recipient.includes(searchLower) || recipientEmail.includes(searchLower) || client.includes(searchLower);
      })
    : statusFiltered;

  const statusCounts: Record<string, number> = {};
  for (const t of tasks) {
    const s = t.status || "NEW";
    statusCounts[s] = (statusCounts[s] || 0) + 1;
  }

  function toggleSelect(taskId: number, e: React.MouseEvent) {
    e.stopPropagation();
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(taskId)) next.delete(taskId);
      else next.add(taskId);
      return next;
    });
  }

  const selectedTasks = tasks.filter((t) => selectedIds.has(t.id));
  const allSelectedReview = selectedTasks.length > 0 && selectedTasks.every((t) => t.status === "READY_FOR_REVIEW");
  const allSelectedApproved = selectedTasks.length > 0 && selectedTasks.every((t) => t.status === "APPROVED");

  async function batchAction(newStatus: string) {
    setBatchLoading(true);
    let count = 0;
    for (const t of selectedTasks) {
      const result = await updateTaskStatus(t.id, newStatus as Parameters<typeof updateTaskStatus>[1]);
      if (result.success) count++;
    }
    toast(`${newStatus === "APPROVED" ? "Approved" : "Marked sent"} ${count} tasks`, "success");
    setSelectedIds(new Set());
    setBatchLoading(false);
    router.refresh();
  }

  const tabs = [
    { key: "all", label: "All" },
    { key: "NEW", label: "New" },
    { key: "READY_FOR_REVIEW", label: "Review" },
    { key: "WAITING_ON_MISSING_DATA", label: "Waiting" },
    { key: "APPROVED", label: "Approved" },
    { key: "SENT", label: "Sent" },
    { key: "EXCEPTION", label: "Exception" },
    ...(overdueTasks.length > 0 ? [{ key: "OVERDUE", label: "Overdue" }] : []),
  ];

  return (
    <div>
      <div className="mb-5 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <h2 className="text-xl font-semibold text-zinc-800">Work Queue</h2>
          {isOwner && (
            <button
              onClick={() => setShowNewTask(!showNewTask)}
              className="rounded-lg bg-zinc-900 px-4 py-1.5 text-xs font-semibold text-white hover:bg-zinc-800 transition-colors"
            >
              {showNewTask ? "Cancel" : "New Task"}
            </button>
          )}
        </div>
      </div>

      {isFirstSession && (
        <div className="mb-4 rounded-lg bg-zinc-100 px-4 py-3 text-sm text-zinc-600">
          Pick a task → review the draft → edit if needed → approve → mark as sent when done
        </div>
      )}

      {/* Filter tabs + search */}
      <div className="mb-5 flex items-end justify-between border-b border-zinc-200">
        <div className="flex">
        {tabs.map((t) => {
          const count = t.key === "all" ? tasks.length : t.key === "OVERDUE" ? overdueTasks.length : (statusCounts[t.key] || 0);
          const active = filter === t.key;
          return (
            <button
              key={t.key}
              onClick={() => setFilter(t.key)}
              className={`relative px-4 py-2.5 text-xs font-medium transition-colors ${
                active
                  ? t.key === "OVERDUE" ? "text-red-700" : "text-zinc-800"
                  : t.key === "OVERDUE" ? "text-red-400 hover:text-red-600" : "text-zinc-400 hover:text-zinc-600"
              }`}
            >
              {t.label}{count > 0 ? ` (${count})` : ""}
              {active && <span className="absolute bottom-0 left-4 right-4 h-[2px] bg-zinc-800" />}
            </button>
          );
        })}
        </div>
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search tasks..."
          className="mb-1 w-52 rounded-lg border border-zinc-300 bg-white px-3 py-1.5 text-xs text-zinc-900 placeholder-zinc-400 focus:border-zinc-400 focus:outline-none"
        />
      </div>

      {showNewTask && <NewTaskForm clients={clients} templates={templates} initialClientId={initialNewTaskClientId} onDone={() => setShowNewTask(false)} />}

      {filtered.length === 0 && (
        filter === "all"
          ? <EmptyState message="No tasks in queue. Create one from a client page or wait for imports." />
          : <EmptyState message={`No ${filter.toLowerCase().replace(/_/g, " ")} tasks.`} />
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
            selected={selectedIds.has(task.id)}
            onSelect={(e) => toggleSelect(task.id, e)}
          />
        ))}
      </div>

      {/* Floating batch action bar */}
      {selectedIds.size > 0 && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-40 flex items-center gap-3 rounded-xl border border-zinc-300 bg-white px-5 py-3 shadow-lg">
          <span className="text-xs font-semibold text-zinc-700">{selectedIds.size} selected</span>
          {allSelectedReview && (
            <button
              onClick={() => batchAction("APPROVED")}
              disabled={batchLoading}
              className="inline-flex items-center gap-1.5 rounded-lg bg-emerald-600 px-4 py-2 text-xs font-semibold text-white hover:bg-emerald-700 disabled:opacity-50 transition-colors"
            >
              {batchLoading && <span className="inline-block h-3 w-3 animate-spin rounded-full border-2 border-white border-t-transparent" />}
              Approve {selectedIds.size}
            </button>
          )}
          {allSelectedApproved && (
            <button
              onClick={() => batchAction("SENT")}
              disabled={batchLoading}
              className="inline-flex items-center gap-1.5 rounded-lg bg-blue-600 px-4 py-2 text-xs font-semibold text-white hover:bg-blue-700 disabled:opacity-50 transition-colors"
            >
              {batchLoading && <span className="inline-block h-3 w-3 animate-spin rounded-full border-2 border-white border-t-transparent" />}
              Mark Sent {selectedIds.size}
            </button>
          )}
          <button
            onClick={() => setSelectedIds(new Set())}
            className="text-xs text-zinc-400 hover:text-zinc-700"
          >
            Clear Selection
          </button>
        </div>
      )}
    </div>
  );
}

function TaskRow({
  task,
  clientName,
  sourceData,
  expanded,
  onToggle,
  selected,
  onSelect,
}: {
  task: Task;
  clientName: string;
  sourceData?: SourceData;
  expanded: boolean;
  onToggle: () => void;
  selected: boolean;
  onSelect: (e: React.MouseEvent) => void;
}) {
  const [loading, setLoading] = useState(false);
  const [generatingDraft, setGeneratingDraft] = useState(false);
  const [editedDraft, setEditedDraft] = useState(task.edited_draft || "");
  const [currentAiDraft, setCurrentAiDraft] = useState(task.ai_draft || "");
  const [rejectReason, setRejectReason] = useState("");
  const [showReject, setShowReject] = useState(false);
  const [needsInfoNotes, setNeedsInfoNotes] = useState("");
  const [showNeedsInfo, setShowNeedsInfo] = useState(false);
  const [exceptionNotes, setExceptionNotes] = useState("");
  const router = useRouter();
  const { toast } = useToast();

  const draftRef = useRef<HTMLTextAreaElement>(null);

  const normalized = (sourceData?.normalized_fields_json as Record<string, Json | undefined>) || {};
  const payload = (sourceData?.payload_json as Record<string, Json | undefined>) || {};
  const status = task.status || "NEW";
  const isReviewable = status === "READY_FOR_REVIEW";
  const age = task.created_at ? timeAgo(task.created_at) : "";
  const hours = task.created_at ? ageHours(task.created_at) : 0;
  const isUnworked = status === "NEW" && hours >= 24;
  const isOverdue = !TERMINAL_STATUSES.includes(status) && hours >= 48;

  // Keyboard shortcuts when expanded
  useEffect(() => {
    if (!expanded) return;
    function handleKey(e: KeyboardEvent) {
      const tag = (document.activeElement?.tagName || "").toLowerCase();
      if (tag === "input" || tag === "textarea" || tag === "select") return;
      if (loading) return;
      if (e.key === "Escape") { onToggle(); return; }
      if (e.key === "a" && status === "READY_FOR_REVIEW") { handleAction("APPROVED"); return; }
      if (e.key === "s" && status === "APPROVED") { handleAction("SENT"); return; }
      if (e.key === "e" && status === "READY_FOR_REVIEW") { draftRef.current?.focus(); return; }
    }
    document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, [expanded, status, loading]);

  async function handleAction(
    newStatus: string,
    extra?: { rejection_reason?: string; notes?: string }
  ) {
    setLoading(true);
    try {
      const result = await updateTaskStatus(task.id, newStatus as Parameters<typeof updateTaskStatus>[1], {
        ...extra,
        edited_draft: editedDraft,
      });
      if (result.success) {
        toast(result.message, "success");
        setShowReject(false);
        setShowNeedsInfo(false);
        setRejectReason("");
        setNeedsInfoNotes("");
        router.refresh();
      } else {
        toast(result.message, "error");
      }
    } catch (err) {
      toast(err instanceof Error ? err.message : "Failed to update status", "error");
    } finally {
      setLoading(false);
    }
  }

  async function saveDraft() {
    const result = await updateTaskDraft(task.id, editedDraft, "edited_draft");
    if (result.success) {
      toast("Draft saved", "success");
    }
  }

  return (
    <div className={`rounded-lg border bg-white ${expanded ? "border-zinc-300 shadow-sm" : "border-zinc-200"}`}>
      {/* Collapsed header */}
      <div className="flex items-center">
        <div className="flex items-center pl-3" onClick={onSelect}>
          <input
            type="checkbox"
            checked={selected}
            readOnly
            className="h-3.5 w-3.5 accent-zinc-900 cursor-pointer"
          />
        </div>
      <button onClick={onToggle} className="flex flex-1 items-center justify-between px-3 py-3 text-left hover:bg-zinc-50 transition-colors rounded-lg">
        <div className="flex items-center gap-3 min-w-0">
          <StatusBadge status={status} />
          <span className="font-medium text-zinc-700 text-xs shrink-0">{clientName}</span>
          <span className="truncate text-sm text-zinc-900">{task.title || "Untitled task"}</span>
        </div>
        <div className="flex shrink-0 items-center gap-3 text-xs">
          <span className="text-zinc-400">{age}</span>
          {isOverdue && <span className="font-semibold text-red-600">2d+ overdue</span>}
          {!isOverdue && isUnworked && <span className="font-semibold text-amber-600">1d+ unworked</span>}
          <span className="text-zinc-300">{expanded ? "▲" : "▼"}</span>
        </div>
      </button>
      </div>

      {/* Expanded workspace */}
      {expanded && (
        <div className="border-t border-zinc-200">
          <div className="grid md:grid-cols-[3fr_2fr]">
            {/* Left column: working area */}
            <div className="space-y-5 p-5 md:border-r md:border-zinc-100">
              {/* Source data */}
              <StructuredSourceData normalized={normalized} payload={payload} />

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
                  {status === "EXCEPTION" && (
                    <div className="mt-3 space-y-3">
                      <textarea
                        value={exceptionNotes}
                        onChange={(e) => setExceptionNotes(e.target.value)}
                        rows={2}
                        className="w-full rounded-lg border border-red-200 bg-white px-3 py-2 text-sm text-zinc-900 placeholder-zinc-400 focus:border-zinc-400 focus:outline-none"
                        placeholder="Resolution notes (optional)..."
                      />
                      <div className="flex items-center gap-3">
                        <button
                          onClick={async () => {
                            setLoading(true);
                            const result = await retryException(task.id, exceptionNotes);
                            if (result.success) { toast("Task retried — moved back to NEW", "success"); router.refresh(); }
                            else { toast(result.message, "error"); }
                            setLoading(false);
                          }}
                          disabled={loading}
                          className="rounded-lg bg-zinc-900 px-5 py-2 text-xs font-semibold text-white hover:bg-zinc-800 disabled:opacity-50 transition-colors"
                        >
                          Retry
                        </button>
                        <button
                          onClick={async () => {
                            setLoading(true);
                            const result = await closeException(task.id, exceptionNotes);
                            if (result.success) { toast("Exception closed", "success"); router.refresh(); }
                            else { toast(result.message, "error"); }
                            setLoading(false);
                          }}
                          disabled={loading}
                          className="rounded-lg border border-zinc-300 bg-white px-5 py-2 text-xs font-semibold text-zinc-700 hover:bg-zinc-50 disabled:opacity-50 transition-colors"
                        >
                          Close
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Draft area */}
              <div className="grid gap-4 lg:grid-cols-2">
                <div>
                  <div className="mb-1.5 flex items-center justify-between">
                    <label className="text-[10px] font-medium uppercase tracking-wider text-zinc-500">
                      AI Draft <span className="font-normal normal-case tracking-normal text-zinc-400">(read-only)</span>
                    </label>
                    {!currentAiDraft && (status === "NEW" || status === "READY_FOR_REVIEW") && task.service_key !== "weekly_summary" && (
                      <button
                        onClick={async () => {
                          setGeneratingDraft(true);
                          try {
                            const result = await generateAiDraft(task.id);
                            if (result.success && result.draft) {
                              setCurrentAiDraft(result.draft);
                              toast("AI draft generated", "success");
                              router.refresh();
                            } else {
                              toast(result.message, "error");
                            }
                          } catch (err) {
                            toast(err instanceof Error ? err.message : "Failed to generate draft", "error");
                          } finally {
                            setGeneratingDraft(false);
                          }
                        }}
                        disabled={generatingDraft}
                        className="inline-flex items-center gap-1.5 rounded-md bg-zinc-900 px-3 py-1 text-[10px] font-semibold text-white hover:bg-zinc-800 disabled:opacity-50 transition-colors"
                      >
                        {generatingDraft && <span className="inline-block h-2.5 w-2.5 animate-spin rounded-full border-[1.5px] border-white border-t-transparent" />}
                        {generatingDraft ? "Generating..." : "Generate Draft"}
                      </button>
                    )}
                  </div>
                  <textarea
                    value={currentAiDraft}
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
                    ref={draftRef}
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
              <p className="text-xs text-zinc-400">Shortcuts: A approve · S send · E edit · Esc close</p>

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
              {/* Recipient contact card */}
              {(task.recipient_name || task.recipient_email) && (
                <div>
                  <label className="mb-2 block text-[10px] font-medium uppercase tracking-wider text-zinc-500">Recipient</label>
                  <div className="rounded-lg border border-zinc-200 bg-white p-3 space-y-1.5">
                    {task.recipient_name && <p className="font-medium text-sm text-zinc-900">{task.recipient_name}</p>}
                    {task.recipient_email && (
                      <a href={`mailto:${task.recipient_email}`} className="block text-xs text-blue-600 hover:text-blue-700 hover:underline">{task.recipient_email}</a>
                    )}
                    {normalized.customer_phone && (
                      <a href={`tel:${String(normalized.customer_phone)}`} className="block text-xs text-blue-600 hover:text-blue-700 hover:underline">{String(normalized.customer_phone)}</a>
                    )}
                    {normalized.amount && (
                      <p className="text-sm font-semibold text-zinc-900">
                        {String(normalized.amount).startsWith("$") ? String(normalized.amount) : `$${Number(String(normalized.amount).replace(/[^0-9.]/g, "")).toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}
                      </p>
                    )}
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

function NewTaskForm({ clients, templates, initialClientId, onDone }: { clients: { id: number; name: string }[]; templates: TaskTemplate[]; initialClientId?: string; onDone: () => void }) {
  const [loading, setLoading] = useState(false);
  const [clientId, setClientId] = useState(initialClientId || "");
  const [serviceKey, setServiceKey] = useState("payment_followup");
  const [templateId, setTemplateId] = useState("");
  const [title, setTitle] = useState("");
  const [recipientName, setRecipientName] = useState("");
  const [recipientEmail, setRecipientEmail] = useState("");
  const [recipientPhone, setRecipientPhone] = useState("");
  const [sourceNotes, setSourceNotes] = useState("");
  const router = useRouter();
  const { toast } = useToast();

  const serviceTemplates = templates.filter((t) => t.service_key === serviceKey);

  function handleServiceChange(newKey: string) {
    setServiceKey(newKey);
    setTemplateId("");
    // Auto-select first template title
    const first = templates.find((t) => t.service_key === newKey);
    if (first) setTitle(first.title);
  }

  function handleTemplateChange(tId: string) {
    setTemplateId(tId);
    const tmpl = templates.find((t) => t.id === tId);
    if (tmpl) setTitle(tmpl.title);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!clientId || !title) return;
    setLoading(true);
    try {
      const result = await createManualTask(Number(clientId), serviceKey, { name: recipientName, email: recipientEmail, phone: recipientPhone }, sourceNotes, title);
      if (result.success) {
        toast("Task created", "success");
        onDone();
        router.refresh();
      } else {
        toast(result.message, "error");
      }
    } catch (err) {
      toast(err instanceof Error ? err.message : "Failed to create task", "error");
    } finally {
      setLoading(false);
    }
  }

  const inputClasses = "w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-900 placeholder-zinc-400 focus:border-zinc-400 focus:outline-none";

  return (
    <form onSubmit={handleSubmit} className="mb-5 rounded-lg border border-zinc-200 bg-white p-5 space-y-4">
      <h3 className="text-sm font-semibold text-zinc-900">Create Task</h3>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div>
          <label className="mb-1.5 block text-[10px] font-medium uppercase tracking-wider text-zinc-500">Client *</label>
          <select value={clientId} onChange={(e) => setClientId(e.target.value)} required className={inputClasses}>
            <option value="">Select client...</option>
            {clients.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
          </select>
        </div>
        <div>
          <label className="mb-1.5 block text-[10px] font-medium uppercase tracking-wider text-zinc-500">Service *</label>
          <select value={serviceKey} onChange={(e) => handleServiceChange(e.target.value)} className={inputClasses}>
            {SERVICE_OPTIONS.map((s) => <option key={s.key} value={s.key}>{s.label}</option>)}
          </select>
        </div>
        {serviceTemplates.length > 1 && (
          <div>
            <label className="mb-1.5 block text-[10px] font-medium uppercase tracking-wider text-zinc-500">Template</label>
            <select value={templateId} onChange={(e) => handleTemplateChange(e.target.value)} className={inputClasses}>
              <option value="">Select template...</option>
              {serviceTemplates.map((t) => <option key={t.id} value={t.id}>{t.title}</option>)}
            </select>
          </div>
        )}
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
      <button type="submit" disabled={loading || !clientId || !serviceKey || !title} className="inline-flex items-center gap-2 rounded-lg bg-zinc-900 px-5 py-2.5 text-xs font-semibold text-white hover:bg-zinc-800 disabled:opacity-50 transition-colors">
        {loading && <span className="inline-block h-3 w-3 animate-spin rounded-full border-2 border-white border-t-transparent" />}
        {loading ? "Creating..." : "Create Task"}
      </button>
    </form>
  );
}
