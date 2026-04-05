import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { QueueList } from "./queue-list";

export default async function QueuePage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: profile } = await supabase.from("profiles").select("*").eq("id", user.id).single();
  if (profile?.role !== "owner") redirect("/dashboard");

  const { data: tasks } = await supabase
    .from("tasks")
    .select("*")
    .in("status", ["NEW", "READY_FOR_REVIEW", "WAITING_ON_MISSING_DATA", "APPROVED", "SENT"])
    .order("due_at", { ascending: true, nullsFirst: false });

  const taskIds = (tasks ?? []).map((t) => t.id);

  // Fetch source data for all tasks in the queue
  const { data: sourceData } = taskIds.length > 0
    ? await supabase.from("task_source_data").select("*").in("task_id", taskIds)
    : { data: [] };

  const sourceMap = Object.fromEntries(
    (sourceData ?? []).map((sd) => [sd.task_id!, sd])
  );

  const { data: clients } = await supabase.from("clients").select("id, name");
  const clientMap = Object.fromEntries((clients ?? []).map((c) => [c.id, c.name]));

  return <QueueList tasks={tasks ?? []} clientMap={clientMap} sourceMap={sourceMap} />;
}
