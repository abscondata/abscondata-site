"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Breadcrumb } from "./breadcrumb";

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
    { href: "/dashboard/imports", label: "Imports" },
    { href: "/dashboard/outreach", label: "Outreach" },
    { href: "/dashboard/onboarding", label: "Onboarding" },
  ];
  const links = role === "owner" ? ownerLinks : [{ href: "/dashboard", label: "My Tasks" }];

  function isActive(href: string) {
    if (href === "/dashboard") return pathname === "/dashboard";
    return pathname.startsWith(href);
  }

  return (
    <div className="flex min-h-screen flex-col bg-zinc-50">
      <header className="border-b border-zinc-200 bg-white">
        <div className="mx-auto flex h-14 max-w-7xl items-center justify-between px-4">
          <div className="flex items-center gap-6">
            <span className="text-sm font-semibold tracking-tight text-zinc-700">Abscondata</span>
            <nav className="flex">
              {links.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`relative px-3 py-4 text-sm transition-colors ${
                    isActive(link.href)
                      ? "font-medium text-zinc-800"
                      : "text-zinc-500 hover:text-zinc-700"
                  }`}
                >
                  {link.label}
                  {isActive(link.href) && (
                    <span className="absolute bottom-0 left-3 right-3 h-[2px] bg-zinc-800" />
                  )}
                </Link>
              ))}
            </nav>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-xs text-zinc-500">{userEmail}</span>
            <button onClick={handleSignOut} className="text-xs text-zinc-500 transition-colors hover:text-zinc-700">Sign out</button>
          </div>
        </div>
      </header>
      <main className="mx-auto w-full max-w-7xl flex-1 px-4 py-6">
        <Breadcrumb />
        {children}
      </main>
    </div>
  );
}
