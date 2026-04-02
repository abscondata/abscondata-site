import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import type { Database } from "@/lib/database.types";

type Client = Database["public"]["Tables"]["clients"]["Row"];

function StatusBadge({ status }: { status: string | null }) {
  const isActive = status?.toLowerCase() === "active";
  return (
    <span
      className={`rounded-full px-2 py-0.5 text-xs font-medium ${
        isActive
          ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
          : "bg-zinc-100 text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400"
      }`}
    >
      {status ?? "—"}
    </span>
  );
}

export default async function ClientsPage() {
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

  if (profile?.role !== "owner") redirect("/dashboard");

  const { data: clients } = await supabase
    .from("clients")
    .select("*")
    .order("name");

  return (
    <div>
      <h2 className="mb-4 text-lg font-semibold text-zinc-900 dark:text-zinc-100">
        Clients
      </h2>

      <div className="overflow-x-auto rounded-lg border border-zinc-200 dark:border-zinc-800">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-zinc-200 bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-900">
            <tr>
              <th className="px-4 py-2 font-medium text-zinc-600 dark:text-zinc-400">Name</th>
              <th className="px-4 py-2 font-medium text-zinc-600 dark:text-zinc-400">Niche</th>
              <th className="px-4 py-2 font-medium text-zinc-600 dark:text-zinc-400">Status</th>
              <th className="px-4 py-2 font-medium text-zinc-600 dark:text-zinc-400">Contact</th>
              <th className="px-4 py-2 font-medium text-zinc-600 dark:text-zinc-400">Employees</th>
              <th className="px-4 py-2 font-medium text-zinc-600 dark:text-zinc-400">Pain Point</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800">
            {(clients ?? []).map((client: Client) => (
              <tr key={client.id} className="bg-white dark:bg-zinc-900/50">
                <td className="px-4 py-2 font-medium text-zinc-900 dark:text-zinc-100">
                  {client.name}
                </td>
                <td className="px-4 py-2 text-zinc-600 dark:text-zinc-400">{client.niche ?? "—"}</td>
                <td className="px-4 py-2">
                  <StatusBadge status={client.status} />
                </td>
                <td className="px-4 py-2">
                  <div className="text-zinc-900 dark:text-zinc-100">
                    {client.primary_contact_name ?? "—"}
                  </div>
                  <div className="text-xs text-zinc-500 dark:text-zinc-400">
                    {client.primary_contact_email ?? ""}
                  </div>
                </td>
                <td className="px-4 py-2 text-zinc-600 dark:text-zinc-400">
                  {client.employee_count ?? "—"}
                </td>
                <td className="max-w-xs truncate px-4 py-2 text-zinc-600 dark:text-zinc-400">
                  {client.pain_point ?? "—"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
