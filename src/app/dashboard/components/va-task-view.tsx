"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import type { Database } from "@/lib/database.types";

type Task = Database["public"]["Tables"]["tasks"]["Row"];

export function VATaskView({ tasks, userEmail }: { tasks: Task[]; userEmail: string }) {
  if (tasks.length === 0) {
    return <div className="flex flex-col items-center justify-center py-20"><p className="text-sm text-zinc-500 dark:text-zinc-400">No tasks assigned to you right now.</p></div>;
  }

  return (
    <div>
      <h2 className="mb-4 text-lg font-semibold text-zinc-900 dark:text-zinc-100">Your Tasks</h2>
      <div className="flex flex-col gap-3">
        {tasks.map((task) => <TaskCard key={task.id} task={task} userEmail={userEmail} />)}
      </div>
    </div>
  );
}

function TaskCard({ task, userEmail }: { task: Task; userEmail: string }) {
  const [aiDraft, setAiDraft] = useState(task.ai_draft ?? "");
  const [approving, setApproving] = useState(false);
  const [approved, setApproved] = useState(false);
  const router = useRouter();
  const supabase = createClient();

  async function handleApprove() {
    setApproving(true);
    const { error } = await supabase.from("tasks").update({ status: "APPROVED", ai_draft: aiDraft }).eq("id", task.id);
    if (error) { setApproving(false); alert("Failed: " + error.message); return; }
    await supabase.from("task_logs").insert({ task_id: task.id, log_type: "completed", message: `Task approved by ${userEmail}`, created_by: userEmail });
    setApproved(true);
    setApproving(false);
    router.refresh();
  }

  if (approved) return <div className="rounded-lg border border-green-200 bg-green-50 p-4 dark:border-green-800 dark:bg-green-900/20"><p className="text-sm font-medium text-green-700 dark:text-green-400">Approved — {task.title}</p></div>;

  const priorityColor = { high: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400", medium: "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400", low: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400" }[(task.priority ?? "").toLowerCase()] ?? "bg-zinc-100 text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400";

  return (
    <div className="rounded-lg border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-900">
      <div className="mb-3 flex items-start justify-between gap-3">
        <div>
          <h3 className="text-sm font-medium text-zinc-900 dark:text-zinc-100">{task.title}</h3>
          <div className="mt-1 flex items-center gap-2 text-xs text-zinc-500 dark:text-zinc-400">
            {task.task_type && <span>{task.task_type}</span>}
            {task.due_at && <><span>·</span><span>Due {new Date(task.due_at).toLocaleDateString("en-US", { month: "short", day: "numeric", hour: "numeric", minute: "2-digit" })}</span></>}
          </div>
        </div>
        <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${priorityColor}`}>{task.priority ?? "—"}</span>
      </div>
      <textarea value={aiDraft} onChange={(e) => setAiDraft(e.target.value)} rows={4} className="mb-3 w-full rounded-md border border-zinc-200 bg-zinc-50 px-3 py-2 text-sm text-zinc-900 placeholder-zinc-400 focus:border-zinc-400 focus:outline-none dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-100" placeholder="AI draft will appear here..." />
      <button onClick={handleApprove} disabled={approving} className="rounded-md bg-zinc-900 px-4 py-1.5 text-sm font-medium text-white transition-colors hover:bg-zinc-800 disabled:opacity-50 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-200">{approving ? "Approving..." : "Approve & Complete"}</button>
    </div>
  );
}
