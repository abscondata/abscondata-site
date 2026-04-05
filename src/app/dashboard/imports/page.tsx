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
        <h3 className="mb-3 text-sm font-semibold text-zinc-900">Import History</h3>
        {(!imports || imports.length === 0) ? (
          <p className="text-sm text-zinc-400">No imports yet.</p>
        ) : (
          <div className="overflow-hidden rounded-lg border border-zinc-200">
            <table className="w-full text-sm">
              <thead className="border-b border-zinc-200 bg-zinc-50">
                <tr>
                  {["Type", "Client", "File", "Rows", "Status", "Date"].map((h) => (
                    <th key={h} className="px-4 py-2.5 text-left text-[10px] font-semibold uppercase tracking-wider text-zinc-500">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-100">
                {imports.map((imp) => (
                  <tr key={imp.id} className="bg-white">
                    <td className="px-4 py-2.5 font-medium text-zinc-900">{imp.import_type}</td>
                    <td className="px-4 py-2.5 text-zinc-600">{imp.client_id ? clientMap[imp.client_id] || "" : ""}</td>
                    <td className="px-4 py-2.5 text-zinc-500">{imp.source_name || "—"}</td>
                    <td className="px-4 py-2.5 text-zinc-600">{imp.row_count}</td>
                    <td className="px-4 py-2.5">
                      <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${imp.status === "completed" ? "bg-emerald-50 text-emerald-700 border border-emerald-200" : "bg-zinc-50 text-zinc-600 border border-zinc-200"}`}>
                        {imp.status}
                      </span>
                    </td>
                    <td className="px-4 py-2.5 text-zinc-400">{new Date(imp.created_at).toLocaleDateString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
