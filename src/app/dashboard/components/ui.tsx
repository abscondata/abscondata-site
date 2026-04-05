import Link from "next/link";

// Consistent status badge colors across the entire dashboard
const BADGE_STYLES: Record<string, string> = {
  NEW: "bg-zinc-100 text-zinc-600",
  WAITING_ON_MISSING_DATA: "bg-amber-50 text-amber-700",
  READY_FOR_REVIEW: "bg-amber-100 text-amber-800",
  APPROVED: "bg-blue-50 text-blue-700",
  SENT: "bg-emerald-50 text-emerald-700",
  CLOSED: "bg-zinc-50 text-zinc-400",
  EXCEPTION: "bg-red-50 text-red-700",
  // Non-task statuses
  active: "bg-emerald-50 text-emerald-700",
  pending: "bg-amber-50 text-amber-700",
  converted: "bg-emerald-50 text-emerald-700",
  rejected: "bg-red-50 text-red-700",
  completed: "bg-emerald-50 text-emerald-700",
  new: "bg-zinc-100 text-zinc-600",
};

export function StatusBadge({ status }: { status: string | null }) {
  const s = status || "NEW";
  const style = BADGE_STYLES[s] || "bg-zinc-100 text-zinc-600";
  return (
    <span className={`inline-flex rounded-full px-2.5 py-0.5 text-[10px] font-semibold ${style}`}>
      {s.replace(/_/g, " ")}
    </span>
  );
}

export function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <h3 className="text-xs font-medium uppercase tracking-wide text-zinc-400">
      {children}
    </h3>
  );
}

export function PageHeader({ children }: { children: React.ReactNode }) {
  return (
    <h2 className="text-xl font-semibold text-zinc-800">
      {children}
    </h2>
  );
}

export function EmptyState({ message, actionLabel, actionHref }: { message: string; actionLabel?: string; actionHref?: string }) {
  return (
    <div className="rounded-lg border border-zinc-200 bg-white px-6 py-12 text-center">
      <p className="text-sm text-zinc-400">{message}</p>
      {actionLabel && actionHref && (
        <Link href={actionHref} className="mt-3 inline-block text-xs font-medium text-zinc-500 hover:text-zinc-700 transition-colors">
          {actionLabel} →
        </Link>
      )}
    </div>
  );
}
