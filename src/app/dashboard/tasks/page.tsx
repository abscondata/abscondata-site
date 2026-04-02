import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { TasksTable } from "../components/tasks-table";

export default async function TasksPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: profile } = await supabase.from("profiles").select("*").eq("id", user.id).single();
  if (profile?.role !== "owner") redirect("/dashboard");

  const [{ data: tasks }, { data: clients }] = await Promise.all([
    supabase.from("tasks").select("*").order("due_at", { ascending: true }),
    supabase.from("clients").select("id, name").order("name"),
  ]);

  return <TasksTable tasks={tasks ?? []} clients={clients ?? []} />;
}
