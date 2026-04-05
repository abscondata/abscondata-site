import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { QueueList } from "./queue-list";

export default async function QueuePage({ searchParams }: { searchParams: Promise<{ task?: string; filter?: string }> }) {
  const { task: expandTaskId, filter: initialFilter } = await searchParams;
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: profile } = await supabase.from("profiles").select("*").eq("id", user.id).single();
  if (profile?.role !== "owner") redirect("/dashboard");

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

  return (
    <QueueList
      tasks={tasks ?? []}
      clientMap={clientMap}
      sourceMap={sourceMap}
      clients={clients ?? []}
      initialExpandId={expandTaskId ? Number(expandTaskId) : undefined}
      initialFilter={initialFilter}
    />
  );
}
