"use client";

import { useState } from "react";
import { updateTaskStatus, updateTaskDraft } from "./actions";
import { useRouter } from "next/navigation";
import type { Database } from "@/lib/database.types";

type Task = Database["public"]["Tables"]["tasks"]["Row"];

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
};

export function QueueList({ tasks, clientMap }: { tasks: Task[]; clientMap: Record<number, string> }) {
  const [expandedId, setExpandedId] = useState<number | null>(null);

  return (
    <div>
      <h2 className="mb-4 text-lg font-semibold text-zinc-900 dark:text-zinc-100">Work Queue</h2>
      {tasks.length === 0 && (
        <p className="py-12 text-center text-sm text-zinc-500 dark:text-zinc-400">Queue is empty. All caught up.</p>
      )}
      <div className="space-y-2">
        {tasks.map((task) => (
          <TaskRow
            key={task.id}
            task={task}
            clientName={task.client_id ? clientMap[task.client_id] || "Unknown" : "—"}
            expanded={expandedId === task.id}
            onToggle={() => setExpandedId(expandedId === task.id ? null : task.id)}
          />
        ))}
      </div>
    </div>
  );
}

function TaskRow({ task, clientName, expanded, onToggle }: { task: Task; clientName: string; expanded: boolean; onToggle: () => void }) {
  const [loading, setLoading] = useState(false);
  const [draft, setDraft] = useState(task.ai_draft || "");
  const [rejectReason, setRejectReason] = useState("");
  const [showReject, setShowReject] = useState(false);
  const router = useRouter();

  async function handleAction(status: "READY_FOR_REVIEW" | "APPROVED" | "SENT" | "NEW", extra?: { rejection_reason?: string }) {
    setLoading(true);
    try {
      await updateTaskStatus(task.id, status, { ...extra, ai_draft: draft });
      setShowReject(false);
      router.refresh();
    } catch (err) {
      alert(err instanceof Error ? err.message : "Failed");
    } finally {
      setLoading(false);
    }
  }

  async function saveDraft() {
    try {
      await updateTaskDraft(task.id, draft);
    } catch {
      // silent
    }
  }

  return (
    <div className="rounded-lg border border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-900">
      <button onClick={onToggle} className="flex w-full items-center justify-between px-4 py-3 text-left">
        <div className="flex items-center gap-3">
          <span className={`rounded-full px-2 py-0.5 text-[10px] font-medium ${STATUS_COLORS[task.status || "NEW"] || STATUS_COLORS.NEW}`}>
            {task.status}
          </span>
          <span className="text-sm font-medium text-zinc-900 dark:text-zinc-100">{task.title}</span>
        </div>
        <div className="flex items-center gap-3 text-xs text-zinc-500 dark:text-zinc-400">
          <span>{clientName}</span>
          <span>{SERVICE_LABELS[task.service_key || ""] || task.service_key || ""}</span>
          {task.due_at && <span>{new Date(task.due_at).toLocaleDateString("en-US", { month: "short", day: "numeric" })}</span>}
          <span className="text-zinc-300 dark:text-zinc-600">{expanded ? "▲" : "▼"}</span>
        </div>
      </button>

      {expanded && (
        <div className="border-t border-zinc-100 px-4 py-4 dark:border-zinc-800">
          {task.notes && <p className="mb-3 text-xs text-zinc-500 dark:text-zinc-400">{task.notes}</p>}

          <div className="mb-3">
            <label className="mb-1 block text-xs font-medium text-zinc-600 dark:text-zinc-400">Draft / Notes</label>
            <textarea
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              onBlur={saveDraft}
              rows={3}
              className="w-full rounded-md border border-zinc-200 bg-zinc-50 px-3 py-2 text-sm text-zinc-900 focus:border-zinc-400 focus:outline-none dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-100"
              placeholder="Draft content, notes, or AI-generated text..."
            />
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {task.status === "NEW" && (
              <button
                onClick={() => handleAction("READY_FOR_REVIEW")}
                disabled={loading}
                className="rounded-md bg-zinc-900 px-3 py-1.5 text-xs font-medium text-white hover:bg-zinc-800 disabled:opacity-50 dark:bg-zinc-100 dark:text-zinc-900"
              >
                Start → Ready for Review
              </button>
            )}
            {task.status === "READY_FOR_REVIEW" && (
              <>
                <button
                  onClick={() => handleAction("APPROVED")}
                  disabled={loading}
                  className="rounded-md bg-green-700 px-3 py-1.5 text-xs font-medium text-white hover:bg-green-600 disabled:opacity-50"
                >
                  Approve
                </button>
                <button
                  onClick={() => setShowReject(!showReject)}
                  disabled={loading}
                  className="rounded-md bg-zinc-200 px-3 py-1.5 text-xs font-medium text-zinc-700 hover:bg-zinc-300 disabled:opacity-50 dark:bg-zinc-700 dark:text-zinc-200"
                >
                  Reject
                </button>
              </>
            )}
            {task.status === "APPROVED" && (
              <button
                onClick={() => handleAction("SENT")}
                disabled={loading}
                className="rounded-md bg-blue-700 px-3 py-1.5 text-xs font-medium text-white hover:bg-blue-600 disabled:opacity-50"
              >
                Mark Sent
              </button>
            )}
            {task.status === "WAITING_ON_MISSING_DATA" && (
              <button
                onClick={() => handleAction("READY_FOR_REVIEW")}
                disabled={loading}
                className="rounded-md bg-zinc-900 px-3 py-1.5 text-xs font-medium text-white hover:bg-zinc-800 disabled:opacity-50 dark:bg-zinc-100 dark:text-zinc-900"
              >
                Data Received → Ready for Review
              </button>
            )}
          </div>

          {showReject && (
            <div className="mt-3 flex items-end gap-2">
              <div className="flex-1">
                <label className="mb-1 block text-xs text-zinc-500">Rejection reason</label>
                <input
                  value={rejectReason}
                  onChange={(e) => setRejectReason(e.target.value)}
                  className="w-full rounded-md border border-zinc-200 px-3 py-1.5 text-sm dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-100"
                />
              </div>
              <button
                onClick={() => handleAction("NEW", { rejection_reason: rejectReason })}
                disabled={loading || !rejectReason}
                className="rounded-md bg-red-700 px-3 py-1.5 text-xs font-medium text-white hover:bg-red-600 disabled:opacity-50"
              >
                Confirm Reject
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
