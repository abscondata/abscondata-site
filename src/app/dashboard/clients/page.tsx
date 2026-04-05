import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import { StatusBadge } from "../components/ui";
import type { Database } from "@/lib/database.types";

type Client = Database["public"]["Tables"]["clients"]["Row"];

export default async function ClientsPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: profile } = await supabase.from("profiles").select("*").eq("id", user.id).single();
  if (profile?.role !== "owner") redirect("/dashboard");

  const { data: clients } = await supabase.from("clients").select("*").order("name");

  // Get open task counts per client
  const { data: openTasks } = await supabase
    .from("tasks")
    .select("client_id")
    .neq("status", "CLOSED");

  const taskCounts: Record<number, number> = {};
  for (const t of openTasks ?? []) {
    if (t.client_id) taskCounts[t.client_id] = (taskCounts[t.client_id] || 0) + 1;
  }

  // Get platform health per client
  const { data: platforms } = await supabase
    .from("client_platforms")
    .select("client_id, connection_status");

  const platformHealth: Record<number, "ok" | "pending" | "error"> = {};
  for (const p of platforms ?? []) {
    if (!p.client_id) continue;
    const current = platformHealth[p.client_id];
    if (p.connection_status === "error") {
      platformHealth[p.client_id] = "error";
    } else if (p.connection_status !== "connected" && current !== "error") {
      platformHealth[p.client_id] = "pending";
    } else if (!current) {
      platformHealth[p.client_id] = "ok";
    }
  }

  // Sort: active first
  const sorted = [...(clients ?? [])].sort((a, b) => {
    const aActive = a.status?.toLowerCase() === "active" ? 0 : 1;
    const bActive = b.status?.toLowerCase() === "active" ? 0 : 1;
    if (aActive !== bActive) return aActive - bActive;
    return a.name.localeCompare(b.name);
  });

  const healthDot: Record<string, string> = {
    ok: "bg-emerald-500",
    pending: "bg-amber-400",
    error: "bg-red-500",
  };

  return (
    <div>
      <div className="mb-5 flex items-center justify-between">
        <h2 className="text-xl font-semibold text-zinc-800">Clients</h2>
        <Link href="/dashboard/clients/new" className="rounded-lg bg-zinc-900 px-5 py-2.5 text-xs font-semibold text-white hover:bg-zinc-800 transition-colors">
          New Client
        </Link>
      </div>
      <div className="overflow-hidden rounded-lg border border-zinc-200">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-zinc-200 bg-zinc-50">
            <tr>
              {["Name", "Industry", "Status", "Contact", "Tasks", "Platforms"].map((h) => (
                <th key={h} className="px-4 py-2.5 text-[10px] font-medium uppercase tracking-wider text-zinc-500">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-100">
            {sorted.map((c: Client) => (
              <tr key={c.id} className="bg-white hover:bg-zinc-50 transition-colors">
                <td className="px-4 py-3 font-medium text-zinc-900">
                  <Link href={`/dashboard/clients/${c.id}`} className="hover:underline">{c.name}</Link>
                </td>
                <td className="px-4 py-3 text-zinc-600">{c.niche ?? ""}</td>
                <td className="px-4 py-3">
                  <StatusBadge status={c.status} />
                </td>
                <td className="px-4 py-3">
                  <div className="font-medium text-zinc-900 text-xs">{c.primary_contact_name ?? ""}</div>
                  <div className="text-xs text-zinc-500">{c.primary_contact_email ?? ""}</div>
                </td>
                <td className="px-4 py-3 text-zinc-600">{taskCounts[c.id] || 0}</td>
                <td className="px-4 py-3">
                  {platformHealth[c.id] ? (
                    <span className={`inline-block h-2 w-2 rounded-full ${healthDot[platformHealth[c.id]] || healthDot.ok}`} title={platformHealth[c.id]} />
                  ) : (
                    <span className="text-xs text-zinc-400">none</span>
                  )}
                </td>
              </tr>
            ))}
            {sorted.length === 0 && (
              <tr><td colSpan={6} className="px-4 py-12 text-center text-sm text-zinc-400">No clients yet.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
