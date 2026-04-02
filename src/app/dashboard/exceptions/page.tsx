import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import type { Database } from "@/lib/database.types";

type Exception = Database["public"]["Tables"]["exceptions"]["Row"];

export default async function ExceptionsPage() {
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

  const [{ data: exceptions }, { data: clients }] = await Promise.all([
    supabase
      .from("exceptions")
      .select("*")
      .order("created_at", { ascending: false }),
    supabase.from("clients").select("id, name"),
  ]);

  const clientMap = Object.fromEntries(
    (clients ?? []).map((c) => [c.id, c.name])
  );

  return (
    <div>
      <h2 className="mb-4 text-lg font-semibold text-zinc-900 dark:text-zinc-100">
        Exceptions
      </h2>

      <div className="space-y-3">
        {(exceptions ?? []).map((ex: Exception) => (
          <div
            key={ex.id}
            className={`rounded-lg border p-4 ${
              ex.resolution_status?.toLowerCase() === "resolved"
                ? "border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-900"
                : "border-red-200 bg-red-50 dark:border-red-800 dark:bg-red-900/20"
            }`}
          >
            <div className="flex items-start justify-between gap-3">
              <div className="flex-1">
                <p className="text-sm font-medium text-zinc-900 dark:text-zinc-100">
                  {ex.description ?? "No description"}
                </p>
                <div className="mt-1 flex items-center gap-2 text-xs text-zinc-500 dark:text-zinc-400">
                  <span>{ex.issue_type ?? "—"}</span>
                  <span>·</span>
                  <span>
                    {ex.client_id ? clientMap[ex.client_id] ?? "Unknown" : "—"}
                  </span>
                  <span>·</span>
                  <span>
                    {new Date(ex.created_at).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                    })}
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span
                  className={`rounded-full px-2 py-0.5 text-xs font-medium ${
                    ex.severity?.toLowerCase() === "high" ||
                    ex.severity?.toLowerCase() === "critical"
                      ? "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400"
                      : ex.severity?.toLowerCase() === "medium"
                        ? "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400"
                        : "bg-zinc-100 text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400"
                  }`}
                >
                  {ex.severity ?? "—"}
                </span>
                <span
                  className={`rounded-full px-2 py-0.5 text-xs font-medium ${
                    ex.resolution_status?.toLowerCase() === "resolved"
                      ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
                      : "bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400"
                  }`}
                >
                  {ex.resolution_status ?? "Open"}
                </span>
              </div>
            </div>
          </div>
        ))}

        {(exceptions ?? []).length === 0 && (
          <p className="py-8 text-center text-sm text-zinc-500 dark:text-zinc-400">
            No exceptions recorded.
          </p>
        )}
      </div>
    </div>
  );
}
