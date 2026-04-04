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
    .in("status", ["NEW", "READY_FOR_REVIEW", "WAITING_ON_MISSING_DATA", "APPROVED"])
    .order("due_at", { ascending: true, nullsFirst: false });

  const { data: clients } = await supabase.from("clients").select("id, name");
  const clientMap = Object.fromEntries((clients ?? []).map((c) => [c.id, c.name]));

  return <QueueList tasks={tasks ?? []} clientMap={clientMap} />;
}
