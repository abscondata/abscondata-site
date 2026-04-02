import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import type { Database } from "@/lib/database.types";

type Client = Database["public"]["Tables"]["clients"]["Row"];

export default async function ClientsPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: profile } = await supabase.from("profiles").select("*").eq("id", user.id).single();
  if (profile?.role !== "owner") redirect("/dashboard");

  const { data: clients } = await supabase.from("clients").select("*").order("name");

  return (
    <div>
      <h2 className="mb-4 text-lg font-semibold text-zinc-900 dark:text-zinc-100">Clients</h2>
      <div className="overflow-x-auto rounded-lg border border-zinc-200 dark:border-zinc-800">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-zinc-200 bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-900">
            <tr>
              {["Name", "Niche", "Status", "Contact", "Employees", "Pain Point"].map((h) => <th key={h} className="px-4 py-2 font-medium text-zinc-600 dark:text-zinc-400">{h}</th>)}
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800">
            {(clients ?? []).map((c: Client) => (
              <tr key={c.id} className="bg-white dark:bg-zinc-900/50">
                <td className="px-4 py-2 font-medium text-zinc-900 dark:text-zinc-100">{c.name}</td>
                <td className="px-4 py-2 text-zinc-600 dark:text-zinc-400">{c.niche ?? "—"}</td>
                <td className="px-4 py-2"><span className={`rounded-full px-2 py-0.5 text-xs font-medium ${c.status?.toLowerCase() === "active" ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400" : "bg-zinc-100 text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400"}`}>{c.status ?? "—"}</span></td>
                <td className="px-4 py-2"><div className="text-zinc-900 dark:text-zinc-100">{c.primary_contact_name ?? "—"}</div><div className="text-xs text-zinc-500 dark:text-zinc-400">{c.primary_contact_email ?? ""}</div></td>
                <td className="px-4 py-2 text-zinc-600 dark:text-zinc-400">{c.employee_count ?? "—"}</td>
                <td className="max-w-xs truncate px-4 py-2 text-zinc-600 dark:text-zinc-400">{c.pain_point ?? "—"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
