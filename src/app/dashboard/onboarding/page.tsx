import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { ConvertButton } from "./convert-button";

const SERVICE_LABELS: Record<string, string> = {
  invoice_ops: "Invoice Operations",
  payment_followup: "Payment Follow-Up",
  review_requests: "Review Requests",
  weekly_summary: "Weekly Business Summary",
  lead_intake: "Lead & Intake Admin",
};

export default async function OnboardingReviewPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: profile } = await supabase.from("profiles").select("*").eq("id", user.id).single();
  if (profile?.role !== "owner") redirect("/dashboard");

  const { data: submissions } = await supabase
    .from("onboarding_submissions")
    .select("*")
    .order("created_at", { ascending: false });

  return (
    <div>
      <h2 className="mb-5 text-lg font-semibold text-zinc-900">Onboarding Submissions</h2>

      {(!submissions || submissions.length === 0) && (
        <p className="py-12 text-center text-sm text-zinc-400">No submissions yet.</p>
      )}

      <div className="space-y-3">
        {(submissions ?? []).map((sub) => {
          const p = sub.payload_json as Record<string, unknown>;
          const services = (p.services as string[]) || [];
          const isPending = sub.status === "pending";

          return (
            <div key={sub.id} className="rounded-lg border border-zinc-200 bg-white p-5">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <h3 className="text-sm font-semibold text-zinc-900">
                    {String(p.company || "Unknown Company")}
                  </h3>
                  <div className="mt-1.5 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-zinc-500">
                    <span className="font-medium text-zinc-700">{String(p.contact_name || "")}</span>
                    <span>{String(p.email || "")}</span>
                    {p.phone ? <span>{String(p.phone)}</span> : null}
                    <span className="text-zinc-400">{new Date(sub.created_at).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}</span>
                  </div>
                  {services.length > 0 && (
                    <div className="mt-2.5 flex flex-wrap gap-1.5">
                      {services.map((key) => (
                        <span key={key} className="rounded-full border border-zinc-200 bg-zinc-50 px-2.5 py-0.5 text-xs font-medium text-zinc-600">
                          {SERVICE_LABELS[key] || key}
                        </span>
                      ))}
                    </div>
                  )}
                  {p.industry ? <p className="mt-1.5 text-xs text-zinc-500">{String(p.industry)}</p> : null}
                  {p.notes ? <p className="mt-2 text-xs italic text-zinc-500">&quot;{String(p.notes)}&quot;</p> : null}
                </div>
                <div className="flex shrink-0 items-center gap-3">
                  <span className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${isPending ? "border border-amber-200 bg-amber-50 text-amber-700" : "border border-emerald-200 bg-emerald-50 text-emerald-700"}`}>
                    {sub.status}
                  </span>
                  {isPending && <ConvertButton submissionId={sub.id} />}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
