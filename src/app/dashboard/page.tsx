import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { VATaskView } from "./components/va-task-view";
import { OwnerOverview } from "./components/owner-overview";

export default async function DashboardPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single();

  if (!profile) redirect("/login");

  if (profile.role === "va") {
    const { data: tasks } = await supabase
      .from("tasks")
      .select("*")
      .eq("assigned_va", profile.email)
      .neq("status", "complete")
      .order("due_at", { ascending: true });

    return <VATaskView tasks={tasks ?? []} userEmail={profile.email} />;
  }

  // Owner: fetch summary data
  const [
    { data: clients },
    { data: tasks },
    { data: exceptions },
    { data: reports },
  ] = await Promise.all([
    supabase.from("clients").select("*").order("name"),
    supabase
      .from("tasks")
      .select("*")
      .neq("status", "complete")
      .order("due_at", { ascending: true })
      .limit(20),
    supabase
      .from("exceptions")
      .select("*")
      .neq("resolution_status", "resolved")
      .order("created_at", { ascending: false })
      .limit(10),
    supabase
      .from("weekly_reports")
      .select("*")
      .order("week_start", { ascending: false })
      .limit(10),
  ]);

  return (
    <OwnerOverview
      clients={clients ?? []}
      tasks={tasks ?? []}
      exceptions={exceptions ?? []}
      reports={reports ?? []}
    />
  );
}
