"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export function DashboardShell({ userEmail, role, children }: { userEmail: string; role: "owner" | "va"; children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const supabase = createClient();

  async function handleSignOut() {
    await supabase.auth.signOut();
    router.push("/login");
    router.refresh();
  }

  const ownerLinks = [
    { href: "/dashboard", label: "Overview" },
    { href: "/dashboard/queue", label: "Queue" },
    { href: "/dashboard/clients", label: "Clients" },
    { href: "/dashboard/onboarding", label: "Onboarding" },
    { href: "/dashboard/imports", label: "Imports" },
    { href: "/dashboard/tasks", label: "Tasks" },
    { href: "/dashboard/exceptions", label: "Exceptions" },
  ];
  const links = role === "owner" ? ownerLinks : [{ href: "/dashboard", label: "My Tasks" }];

  return (
    <div className="flex min-h-screen flex-col bg-zinc-50 dark:bg-zinc-950">
      <header className="border-b border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-900">
        <div className="mx-auto flex h-14 max-w-7xl items-center justify-between px-4">
          <div className="flex items-center gap-6">
            <span className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">Abscondata</span>
            <nav className="flex gap-1">
              {links.map((link) => (
                <Link key={link.href} href={link.href} className={`rounded-md px-3 py-1.5 text-sm transition-colors ${pathname === link.href ? "bg-zinc-100 font-medium text-zinc-900 dark:bg-zinc-800 dark:text-zinc-100" : "text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100"}`}>
                  {link.label}
                </Link>
              ))}
            </nav>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-xs text-zinc-500 dark:text-zinc-400">{userEmail}</span>
            <span className="rounded-full bg-zinc-100 px-2 py-0.5 text-xs font-medium text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400">{role.toUpperCase()}</span>
            <button onClick={handleSignOut} className="text-xs text-zinc-500 transition-colors hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100">Sign out</button>
          </div>
        </div>
      </header>
      <main className="mx-auto w-full max-w-7xl flex-1 px-4 py-6">{children}</main>
    </div>
  );
}
