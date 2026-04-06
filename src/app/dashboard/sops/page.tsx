import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { SopEditor } from "./sop-editor";

export default async function SopsPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: profile } = await supabase.from("profiles").select("*").eq("id", user.id).single();
  if (profile?.role !== "owner") redirect("/dashboard");

  const { data: sops } = await supabase
    .from("sops")
    .select("*")
    .order("trigger")
    .order("title");

  return <SopEditor sops={sops ?? []} />;
}
