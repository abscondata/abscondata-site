"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import type { Database } from "@/lib/database.types";

type Task = Database["public"]["Tables"]["tasks"]["Row"];

export function VATaskView({ tasks, userEmail }: { tasks: Task[]; userEmail: string }) {
  if (tasks.length === 0) {
    return <div className="flex flex-col items-center justify-center py-20"><p className="text-sm text-zinc-400">No tasks assigned to you right now.</p></div>;
  }

  return (
    <div>
      <h2 className="mb-4 text-lg font-semibold text-zinc-900">Your Tasks</h2>
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

  if (approved) return <div className="rounded-lg border border-emerald-200 bg-emerald-50 p-4"><p className="text-sm font-medium text-emerald-700">Approved — {task.title}</p></div>;

  const priorityColor = { high: "border-red-200 bg-red-50 text-red-700", medium: "border-amber-200 bg-amber-50 text-amber-700", low: "border-emerald-200 bg-emerald-50 text-emerald-700" }[(task.priority ?? "").toLowerCase()] ?? "border-zinc-200 bg-zinc-50 text-zinc-600";

  return (
    <div className="rounded-lg border border-zinc-200 bg-white p-4">
      <div className="mb-3 flex items-start justify-between gap-3">
        <div>
          <h3 className="text-sm font-medium text-zinc-900">{task.title}</h3>
          <div className="mt-1 flex items-center gap-2 text-xs text-zinc-500">
            {task.task_type && <span>{task.task_type}</span>}
            {task.due_at && <><span>·</span><span>Due {new Date(task.due_at).toLocaleDateString("en-US", { month: "short", day: "numeric", hour: "numeric", minute: "2-digit" })}</span></>}
          </div>
        </div>
        <span className={`rounded-full border px-2 py-0.5 text-xs font-medium ${priorityColor}`}>{task.priority ?? "—"}</span>
      </div>
      <textarea value={aiDraft} onChange={(e) => setAiDraft(e.target.value)} rows={4} className="mb-3 w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-900 placeholder-zinc-400 focus:border-zinc-400 focus:outline-none" placeholder="AI draft will appear here..." />
      <button onClick={handleApprove} disabled={approving} className="rounded-lg bg-zinc-900 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-zinc-800 disabled:opacity-50">{approving ? "Approving..." : "Approve & Complete"}</button>
    </div>
  );
}
