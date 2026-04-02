import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import type { Database } from "@/lib/database.types";

type WeeklyReport = Database["public"]["Tables"]["weekly_reports"]["Row"];

export default async function ReportsPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: profile } = await supabase.from("profiles").select("*").eq("id", user.id).single();
  if (profile?.role !== "owner") redirect("/dashboard");

  const [{ data: reports }, { data: clients }] = await Promise.all([
    supabase.from("weekly_reports").select("*").order("week_start", { ascending: false }),
    supabase.from("clients").select("id, name"),
  ]);
  const clientMap = Object.fromEntries((clients ?? []).map((c) => [c.id, c.name]));

  return (
    <div>
      <h2 className="mb-4 text-lg font-semibold text-zinc-900 dark:text-zinc-100">Weekly Reports</h2>
      <div className="space-y-3">
        {(reports ?? []).map((r: WeeklyReport) => (
          <div key={r.id} className="rounded-lg border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-900">
            <p className="text-sm font-medium text-zinc-900 dark:text-zinc-100">{r.client_id ? clientMap[r.client_id] ?? "Unknown Client" : "—"}</p>
            <p className="text-xs text-zinc-500 dark:text-zinc-400">Week of {r.week_start ? new Date(r.week_start).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" }) : "—"}</p>
            {r.summary && <p className="mt-3 text-sm text-zinc-700 dark:text-zinc-300">{r.summary}</p>}
            {r.open_issues && <div className="mt-2 rounded-md bg-zinc-50 px-3 py-2 dark:bg-zinc-800/50"><p className="text-xs font-medium text-zinc-500 dark:text-zinc-400">Open Issues</p><p className="mt-0.5 text-sm text-zinc-700 dark:text-zinc-300">{r.open_issues}</p></div>}
          </div>
        ))}
        {(reports ?? []).length === 0 && <p className="py-8 text-center text-sm text-zinc-500 dark:text-zinc-400">No weekly reports yet.</p>}
      </div>
    </div>
  );
}
