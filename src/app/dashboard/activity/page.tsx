import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { ActivityLog } from "./activity-log";

export default async function ActivityPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: profile } = await supabase.from("profiles").select("*").eq("id", user.id).single();
  if (profile?.role !== "owner") redirect("/dashboard");

  // Fetch clients for filter dropdown
  const { data: clients } = await supabase
    .from("clients")
    .select("id, name")
    .order("name");

  // Fetch profiles for actor names
  const { data: profiles } = await supabase
    .from("profiles")
    .select("id, email, role");

  const profileMap = Object.fromEntries(
    (profiles ?? []).map((p) => [p.id, { email: p.email, role: p.role }])
  );

  return (
    <ActivityLog
      clients={clients ?? []}
      profileMap={profileMap}
    />
  );
}
