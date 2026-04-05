import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { VATaskView } from "./components/va-task-view";
import { OwnerOverview } from "./components/owner-overview";

export default async function DashboardPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
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

  // Counts
  const [
    { count: reviewCount },
    { count: newCount },
    { count: pendingOnboarding },
  ] = await Promise.all([
    supabase.from("tasks").select("*", { count: "exact", head: true }).eq("status", "READY_FOR_REVIEW"),
    supabase.from("tasks").select("*", { count: "exact", head: true }).eq("status", "NEW"),
    supabase.from("onboarding_submissions").select("*", { count: "exact", head: true }).eq("status", "pending"),
  ]);

  // Recent activity: task_events with task title and client name
  const { data: recentEvents } = await supabase
    .from("task_events")
    .select("id, task_id, event_type, notes, created_at, tasks(id, title, client_id, clients(id, name))")
    .order("created_at", { ascending: false })
    .limit(10);

  // Active clients with task health
  const { data: activeClients } = await supabase
    .from("clients")
    .select("id, name, status")
    .eq("status", "active")
    .order("name");

  // Get open task counts and oldest task per client
  const { data: openTasks } = await supabase
    .from("tasks")
    .select("id, client_id, status, created_at")
    .neq("status", "CLOSED");

  // Get platform errors
  const { data: platformErrors } = await supabase
    .from("client_platforms")
    .select("client_id, platform_key, connection_status")
    .eq("connection_status", "error");

  // Build client health data
  const clientHealth: Array<{
    id: number;
    name: string;
    openTasks: number;
    oldestTaskDays: number | null;
    platformErrors: string[];
  }> = (activeClients ?? []).map((c) => {
    const clientTasks = (openTasks ?? []).filter((t) => t.client_id === c.id);
    const oldest = clientTasks.reduce<string | null>((min, t) => {
      if (!min || t.created_at < min) return t.created_at;
      return min;
    }, null);
    const oldestDays = oldest
      ? Math.floor((Date.now() - new Date(oldest).getTime()) / (1000 * 60 * 60 * 24))
      : null;
    const errors = (platformErrors ?? [])
      .filter((p) => p.client_id === c.id)
      .map((p) => p.platform_key);

    return {
      id: c.id,
      name: c.name,
      openTasks: clientTasks.length,
      oldestTaskDays: oldestDays,
      platformErrors: errors,
    };
  });

  // Sort by oldest task descending (most urgent first)
  clientHealth.sort((a, b) => (b.oldestTaskDays ?? -1) - (a.oldestTaskDays ?? -1));

  // Format events for the component
  type EventRow = NonNullable<typeof recentEvents>[number];
  const formattedEvents = (recentEvents ?? []).map((e: EventRow) => {
    const task = e.tasks as unknown as { id: number; title: string; client_id: number; clients: { id: number; name: string } | null } | null;
    return {
      id: e.id,
      taskId: task?.id ?? null,
      taskTitle: task?.title ?? "Unknown task",
      clientName: task?.clients?.name ?? "Unknown",
      eventType: e.event_type,
      notes: e.notes,
      createdAt: e.created_at,
    };
  });

  return (
    <OwnerOverview
      reviewCount={reviewCount ?? 0}
      newCount={newCount ?? 0}
      pendingOnboarding={pendingOnboarding ?? 0}
      recentEvents={formattedEvents}
      clientHealth={clientHealth}
    />
  );
}
