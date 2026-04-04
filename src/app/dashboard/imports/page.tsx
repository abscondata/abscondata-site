import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { ImportForm } from "./import-form";

export default async function ImportsPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: profile } = await supabase.from("profiles").select("*").eq("id", user.id).single();
  if (profile?.role !== "owner") redirect("/dashboard");

  const [{ data: clients }, { data: imports }] = await Promise.all([
    supabase.from("clients").select("id, name").order("name"),
    supabase.from("imports").select("*").order("created_at", { ascending: false }).limit(20),
  ]);

  const clientMap = Object.fromEntries((clients ?? []).map((c) => [c.id, c.name]));

  return (
    <div className="space-y-8">
      <ImportForm clients={clients ?? []} />

      <div>
        <h3 className="mb-3 text-sm font-semibold text-zinc-900 dark:text-zinc-100">Import History</h3>
        {(!imports || imports.length === 0) ? (
          <p className="text-sm text-zinc-500">No imports yet.</p>
        ) : (
          <div className="space-y-2">
            {imports.map((imp) => (
              <div key={imp.id} className="flex items-center justify-between rounded-lg border border-zinc-200 bg-white px-4 py-3 dark:border-zinc-800 dark:bg-zinc-900">
                <div>
                  <span className="text-sm font-medium text-zinc-900 dark:text-zinc-100">{imp.import_type}</span>
                  <span className="ml-2 text-xs text-zinc-500">{imp.client_id ? clientMap[imp.client_id] || "" : ""}</span>
                  {imp.source_name && <span className="ml-2 text-xs text-zinc-400">{imp.source_name}</span>}
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-xs text-zinc-500">{imp.row_count} rows</span>
                  <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${imp.status === "completed" ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400" : "bg-zinc-100 text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400"}`}>
                    {imp.status}
                  </span>
                  <span className="text-xs text-zinc-400">{new Date(imp.created_at).toLocaleDateString()}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
