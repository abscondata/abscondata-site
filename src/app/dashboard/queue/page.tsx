import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { QueueList } from "./queue-list";

export default async function QueuePage({ searchParams }: { searchParams: Promise<{ task?: string; filter?: string; newTask?: string }> }) {
  const { task: expandTaskId, filter: initialFilter, newTask: newTaskClientId } = await searchParams;
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: profile } = await supabase.from("profiles").select("*").eq("id", user.id).single();
  const role = profile?.role ?? "va";

  // VA can access queue too (not just owners)
  const { data: tasks } = await supabase
    .from("tasks")
    .select("*")
    .in("status", ["NEW", "READY_FOR_REVIEW", "WAITING_ON_MISSING_DATA", "APPROVED", "SENT", "EXCEPTION"])
    .order("due_at", { ascending: true, nullsFirst: false });

  const taskIds = (tasks ?? []).map((t) => t.id);

  const { data: sourceData } = taskIds.length > 0
    ? await supabase.from("task_source_data").select("*").in("task_id", taskIds)
    : { data: [] };

  const sourceMap = Object.fromEntries(
    (sourceData ?? []).map((sd) => [sd.task_id!, sd])
  );

  const { data: clients } = await supabase.from("clients").select("id, name").eq("status", "active").order("name");
  const clientMap = Object.fromEntries((clients ?? []).map((c) => [c.id, c.name]));

  // Fetch task templates for prefill (owner only)
  // Fetch enabled templates only (enabled column added by migration 008)
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data: templates } = role === "owner"
    ? await (supabase.from("task_templates") as any).select("id, service_key, title, description").neq("enabled", false).order("sort_order", { ascending: true })
    : { data: [] };

  // Check if user has ever completed a task (for first-time banner)
  const { count: completedCount } = await supabase
    .from("task_events")
    .select("*", { count: "exact", head: true })
    .eq("actor_id", user.id)
    .like("event_type", "%SENT%");

  return (
    <QueueList
      tasks={tasks ?? []}
      clientMap={clientMap}
      sourceMap={sourceMap}
      clients={clients ?? []}
      templates={templates ?? []}
      role={role as "owner" | "va"}
      isFirstSession={(completedCount ?? 0) === 0}
      initialExpandId={expandTaskId ? Number(expandTaskId) : undefined}
      initialFilter={initialFilter}
      initialNewTaskClientId={role === "owner" ? newTaskClientId : undefined}
    />
  );
}
