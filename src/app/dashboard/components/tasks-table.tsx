"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import type { Database } from "@/lib/database.types";

type Task = Database["public"]["Tables"]["tasks"]["Row"];

export function TasksTable({ tasks, clients }: { tasks: Task[]; clients: { id: number; name: string }[] }) {
  const [filterClient, setFilterClient] = useState("");
  const [filterStatus, setFilterStatus] = useState("");
  const [filterPriority, setFilterPriority] = useState("");
  const router = useRouter();
  const supabase = createClient();
  const clientMap = Object.fromEntries(clients.map((c) => [c.id, c.name]));

  const filtered = tasks.filter((t) => {
    if (filterClient && t.client_id !== Number(filterClient)) return false;
    if (filterStatus && t.status !== filterStatus) return false;
    if (filterPriority && t.priority !== filterPriority) return false;
    return true;
  });

  const statuses = [...new Set(tasks.map((t) => t.status).filter(Boolean))];
  const priorities = [...new Set(tasks.map((t) => t.priority).filter(Boolean))];

  async function handleAssign(taskId: number, vaEmail: string) {
    await supabase.from("tasks").update({ assigned_va: vaEmail || null }).eq("id", taskId);
    router.refresh();
  }

  return (
    <div>
      <h2 className="mb-4 text-lg font-semibold text-zinc-900 dark:text-zinc-100">All Tasks</h2>
      <div className="mb-4 flex flex-wrap gap-2">
        <select value={filterClient} onChange={(e) => setFilterClient(e.target.value)} className="rounded-md border border-zinc-200 bg-white px-3 py-1.5 text-sm dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-100">
          <option value="">All Clients</option>
          {clients.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
        </select>
        <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)} className="rounded-md border border-zinc-200 bg-white px-3 py-1.5 text-sm dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-100">
          <option value="">All Statuses</option>
          {statuses.map((s) => <option key={s} value={s!}>{s}</option>)}
        </select>
        <select value={filterPriority} onChange={(e) => setFilterPriority(e.target.value)} className="rounded-md border border-zinc-200 bg-white px-3 py-1.5 text-sm dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-100">
          <option value="">All Priorities</option>
          {priorities.map((p) => <option key={p} value={p!}>{p}</option>)}
        </select>
      </div>
      <div className="overflow-x-auto rounded-lg border border-zinc-200 dark:border-zinc-800">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-zinc-200 bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-900">
            <tr>
              {["Title", "Client", "Type", "Status", "Priority", "Due", "Assigned VA"].map((h) => <th key={h} className="px-4 py-2 font-medium text-zinc-600 dark:text-zinc-400">{h}</th>)}
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800">
            {filtered.map((task) => (
              <tr key={task.id} className="bg-white dark:bg-zinc-900/50">
                <td className="px-4 py-2 text-zinc-900 dark:text-zinc-100">{task.title}{task.escalation_required && <span className="ml-2 rounded-full bg-red-100 px-1.5 py-0.5 text-xs text-red-700 dark:bg-red-900/30 dark:text-red-400">Escalation</span>}</td>
                <td className="px-4 py-2 text-zinc-600 dark:text-zinc-400">{task.client_id ? clientMap[task.client_id] ?? "—" : "—"}</td>
                <td className="px-4 py-2 text-zinc-600 dark:text-zinc-400">{task.task_type ?? "—"}</td>
                <td className="px-4 py-2 text-zinc-600 dark:text-zinc-400">{task.status ?? "—"}</td>
                <td className="px-4 py-2"><span className={`rounded-full px-2 py-0.5 text-xs font-medium ${task.priority?.toLowerCase() === "high" ? "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400" : task.priority?.toLowerCase() === "medium" ? "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400" : "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"}`}>{task.priority ?? "—"}</span></td>
                <td className="px-4 py-2 text-zinc-600 dark:text-zinc-400">{task.due_at ? new Date(task.due_at).toLocaleDateString("en-US", { month: "short", day: "numeric" }) : "—"}</td>
                <td className="px-4 py-2"><input type="email" defaultValue={task.assigned_va ?? ""} placeholder="va@email.com" onBlur={(e) => handleAssign(task.id, e.target.value)} className="w-36 rounded border border-zinc-200 bg-transparent px-2 py-1 text-xs dark:border-zinc-700" /></td>
              </tr>
            ))}
            {filtered.length === 0 && <tr><td colSpan={7} className="px-4 py-8 text-center text-zinc-500 dark:text-zinc-400">No tasks match your filters.</td></tr>}
          </tbody>
        </table>
      </div>
    </div>
  );
}
