"use client";

import { useState } from "react";
import { updateTaskStatus } from "../../queue/actions";
import { generateAiDraft } from "../../queue/ai-draft";
import { useRouter } from "next/navigation";
import { useToast } from "../../components/toast";

export function TaskQuickActions({ taskId, status, serviceKey, hasAiDraft }: {
  taskId: number;
  status: string;
  serviceKey: string | null;
  hasAiDraft: boolean;
}) {
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { toast } = useToast();

  async function handleStatus(newStatus: string) {
    setLoading(true);
    try {
      const result = await updateTaskStatus(taskId, newStatus as Parameters<typeof updateTaskStatus>[1]);
      if (result.success) {
        toast(result.message, "success");
        router.refresh();
      } else {
        toast(result.message, "error");
      }
    } catch (err) {
      toast(err instanceof Error ? err.message : "Action failed", "error");
    } finally {
      setLoading(false);
    }
  }

  async function handleGenerate() {
    setLoading(true);
    try {
      const result = await generateAiDraft(taskId);
      if (result.success) {
        toast("AI draft generated", "success");
        router.refresh();
      } else {
        toast(result.message, "error");
      }
    } catch (err) {
      toast(err instanceof Error ? err.message : "Generation failed", "error");
    } finally {
      setLoading(false);
    }
  }

  const btnClass = "rounded-md border border-zinc-300 bg-white px-2.5 py-1 text-[10px] font-semibold text-zinc-700 hover:bg-zinc-50 disabled:opacity-50 transition-colors";

  return (
    <div className="flex items-center gap-1.5">
      {status === "NEW" && !hasAiDraft && serviceKey !== "weekly_summary" && (
        <button onClick={handleGenerate} disabled={loading} className={btnClass}>
          {loading ? "..." : "Generate Draft"}
        </button>
      )}
      {status === "READY_FOR_REVIEW" && (
        <button onClick={() => handleStatus("APPROVED")} disabled={loading} className={btnClass}>
          {loading ? "..." : "Approve"}
        </button>
      )}
      {status === "APPROVED" && (
        <button onClick={() => handleStatus("SENT")} disabled={loading} className={btnClass}>
          {loading ? "..." : "Mark Sent"}
        </button>
      )}
    </div>
  );
}
