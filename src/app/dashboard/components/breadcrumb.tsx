"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const LABELS: Record<string, string> = {
  dashboard: "Overview",
  queue: "Queue",
  clients: "Clients",
  imports: "Imports",
  outreach: "Outreach",
  onboarding: "Onboarding",
  tasks: "Tasks",
  exceptions: "Exceptions",
  reports: "Reports",
  new: "New Client",
};

export function Breadcrumb({ clientName }: { clientName?: string }) {
  const pathname = usePathname();
  const segments = pathname.split("/").filter(Boolean);

  // Don't show breadcrumb on the overview page itself
  if (segments.length <= 1) return null;

  const crumbs: { label: string; href: string }[] = [
    { label: "Overview", href: "/dashboard" },
  ];

  // Build crumbs from path segments after "dashboard"
  for (let i = 1; i < segments.length; i++) {
    const seg = segments[i];
    const href = "/" + segments.slice(0, i + 1).join("/");

    // If this is a dynamic segment like [id], use clientName or skip
    if (seg.match(/^\d+$/)) {
      crumbs.push({ label: clientName || `#${seg}`, href });
    } else {
      crumbs.push({ label: LABELS[seg] || seg, href });
    }
  }

  return (
    <nav className="mb-4 flex items-center gap-1.5 text-sm">
      {crumbs.map((crumb, i) => {
        const isLast = i === crumbs.length - 1;
        return (
          <span key={crumb.href} className="flex items-center gap-1.5">
            {i > 0 && <span className="text-zinc-300">/</span>}
            {isLast ? (
              <span className="text-zinc-700 font-medium">{crumb.label}</span>
            ) : (
              <Link href={crumb.href} className="text-zinc-400 hover:text-zinc-600 transition-colors">
                {crumb.label}
              </Link>
            )}
          </span>
        );
      })}
    </nav>
  );
}
