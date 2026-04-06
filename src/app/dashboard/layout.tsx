import type { Metadata } from "next";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { DashboardShell } from "./components/dashboard-shell";

export const metadata: Metadata = {
  title: "Dashboard",
};

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  // Fetch profile, or auto-create one if missing (handles users created
  // before the profiles trigger was added)
  let { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single();

  if (!profile) {
    const { data: created } = await supabase
      .from("profiles")
      .upsert({ id: user.id, email: user.email ?? "", role: "va" })
      .select("*")
      .single();
    profile = created;
  }

  // If profile still can't be created (e.g. table doesn't exist yet),
  // render a fallback instead of redirecting to /login (which causes a loop)
  const role = profile?.role ?? "va";
  const email = user.email ?? "";

  return (
    <DashboardShell userEmail={email} role={role as "owner" | "va"}>
      {children}
    </DashboardShell>
  );
}
