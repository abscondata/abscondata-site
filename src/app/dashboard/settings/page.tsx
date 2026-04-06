import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { SettingsForm } from "./settings-form";

export default async function SettingsPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: profile } = await supabase.from("profiles").select("*").eq("id", user.id).single();
  if (profile?.role !== "owner") redirect("/dashboard");

  const hasAnthropicKey = !!process.env.ANTHROPIC_API_KEY;
  const commitSha = process.env.NEXT_PUBLIC_VERCEL_GIT_COMMIT_SHA || null;

  const { data: templates } = await supabase
    .from("task_templates")
    .select("*")
    .order("service_key")
    .order("sort_order", { ascending: true });

  return (
    <SettingsForm
      email={user.email ?? ""}
      role={profile?.role ?? "va"}
      hasAnthropicKey={hasAnthropicKey}
      commitSha={commitSha}
      templates={templates ?? []}
    />
  );
}
