import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import Link from "next/link";
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
      <div className="mb-5 flex items-center justify-between">
        <h2 className="text-lg font-semibold text-zinc-900">Clients</h2>
        <Link href="/dashboard/clients/new" className="rounded-lg bg-zinc-900 px-5 py-2.5 text-xs font-semibold text-white hover:bg-zinc-800 transition-colors">
          New Client
        </Link>
      </div>
      <div className="overflow-hidden rounded-lg border border-zinc-200">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-zinc-200 bg-zinc-50">
            <tr>
              {["Name", "Industry", "Status", "Contact", "Employees"].map((h) => (
                <th key={h} className="px-4 py-2.5 text-[10px] font-semibold uppercase tracking-wider text-zinc-500">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-100">
            {(clients ?? []).map((c: Client) => (
              <tr key={c.id} className="bg-white hover:bg-zinc-50 transition-colors">
                <td className="px-4 py-3 font-medium text-zinc-900">
                  <Link href={`/dashboard/clients/${c.id}`} className="hover:underline">{c.name}</Link>
                </td>
                <td className="px-4 py-3 text-zinc-600">{c.niche ?? "—"}</td>
                <td className="px-4 py-3">
                  <span className={`rounded-full border px-2.5 py-0.5 text-xs font-semibold ${c.status?.toLowerCase() === "active" ? "border-emerald-200 bg-emerald-50 text-emerald-700" : "border-zinc-200 bg-zinc-50 text-zinc-600"}`}>
                    {c.status ?? "—"}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <div className="font-medium text-zinc-900">{c.primary_contact_name ?? "—"}</div>
                  <div className="text-xs text-zinc-500">{c.primary_contact_email ?? ""}</div>
                </td>
                <td className="px-4 py-3 text-zinc-600">{c.employee_count ?? "—"}</td>
              </tr>
            ))}
            {(clients ?? []).length === 0 && (
              <tr><td colSpan={5} className="px-4 py-12 text-center text-sm text-zinc-400">No clients yet.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
