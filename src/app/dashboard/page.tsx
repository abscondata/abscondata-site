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

  const role = profile?.role ?? "va";
  const email = profile?.email ?? user.email ?? "";

  if (role === "va") {
    const { data: tasks } = await supabase
      .from("tasks")
      .select("*")
      .eq("assigned_va", email)
      .neq("status", "CLOSED")
      .order("due_at", { ascending: true });

    return <VATaskView tasks={tasks ?? []} userEmail={email} />;
  }

  const [
    { data: clients },
    { data: tasks },
    { count: pendingOnboarding },
  ] = await Promise.all([
    supabase.from("clients").select("*").order("name"),
    supabase.from("tasks").select("*").neq("status", "CLOSED").order("created_at", { ascending: false }).limit(20),
    supabase.from("onboarding_submissions").select("*", { count: "exact", head: true }).eq("status", "pending"),
  ]);

  const clientMap = Object.fromEntries((clients ?? []).map((c) => [c.id, c.name]));

  return (
    <OwnerOverview
      clients={clients ?? []}
      tasks={tasks ?? []}
      pendingOnboarding={pendingOnboarding ?? 0}
      clientMap={clientMap}
    />
  );
}
