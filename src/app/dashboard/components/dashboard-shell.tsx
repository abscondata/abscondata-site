"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Breadcrumb } from "./breadcrumb";
import { ToastProvider } from "./toast";

function useEasternClock() {
  const [time, setTime] = useState("");
  useEffect(() => {
    function update() {
      setTime(
        new Date().toLocaleString("en-US", {
          timeZone: "America/New_York",
          weekday: "short",
          month: "short",
          day: "numeric",
          hour: "numeric",
          minute: "2-digit",
        })
      );
    }
    update();
    const id = setInterval(update, 60000);
    return () => clearInterval(id);
  }, []);
  return time;
}

const NAV_ICONS: Record<string, string> = {
  "/dashboard": "⊞",
  "/dashboard/queue": "☰",
  "/dashboard/clients": "⧫",
};

export function DashboardShell({ userEmail, role, children }: { userEmail: string; role: "owner" | "va"; children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const supabase = createClient();
  const [moreOpen, setMoreOpen] = useState(false);

  const clock = useEasternClock();

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
    { href: "/dashboard/activity", label: "Activity" },
    { href: "/dashboard/sops", label: "SOPs" },
    { href: "/dashboard/onboarding", label: "Onboarding" },
    { href: "/dashboard/settings", label: "Settings" },
  ];
  const vaLinks = [
    { href: "/dashboard", label: "Overview" },
    { href: "/dashboard/queue", label: "Queue" },
  ];
  const links = role === "owner" ? ownerLinks : vaLinks;

  function isActive(href: string) {
    if (href === "/dashboard") return pathname === "/dashboard";
    return pathname.startsWith(href);
  }

  // Mobile: first 3 links as tabs, rest in "More" menu
  const primaryLinks = links.slice(0, 3);
  const moreLinks = links.slice(3);

  return (
    <div className="flex min-h-screen flex-col bg-zinc-50">
      {/* Desktop header */}
      <header className="hidden md:block border-b border-zinc-200 bg-white">
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
            {clock && <span className="text-xs text-zinc-400">{clock}</span>}
            <span className="text-xs text-zinc-500">{userEmail}</span>
            <button onClick={handleSignOut} className="text-xs text-zinc-500 transition-colors hover:text-zinc-700">Sign out</button>
          </div>
        </div>
      </header>

      {/* Mobile header — minimal */}
      <header className="md:hidden border-b border-zinc-200 bg-white">
        <div className="flex h-12 items-center justify-between px-4">
          <span className="text-sm font-semibold tracking-tight text-zinc-700">Abscondata</span>
          <div className="flex items-center gap-3">
            {clock && <span className="text-[10px] text-zinc-400">{clock}</span>}
            <button onClick={handleSignOut} className="text-[10px] text-zinc-500">Sign out</button>
          </div>
        </div>
      </header>

      <main className="mx-auto w-full max-w-7xl flex-1 px-4 py-6 pb-20 md:pb-6">
        <ToastProvider>
          <Breadcrumb />
          {children}
        </ToastProvider>
      </main>

      {/* Mobile bottom tab bar */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 border-t border-zinc-200 bg-white">
        <div className="flex items-center justify-around py-2">
          {primaryLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`flex flex-col items-center gap-0.5 px-3 py-1 ${
                isActive(link.href) ? "text-zinc-800" : "text-zinc-400"
              }`}
            >
              <span className="text-lg">{NAV_ICONS[link.href] || "○"}</span>
              <span className="text-[9px] font-medium">{link.label}</span>
            </Link>
          ))}
          {moreLinks.length > 0 && (
            <button
              onClick={() => setMoreOpen(!moreOpen)}
              className={`flex flex-col items-center gap-0.5 px-3 py-1 ${moreOpen ? "text-zinc-800" : "text-zinc-400"}`}
            >
              <span className="text-lg">⋯</span>
              <span className="text-[9px] font-medium">More</span>
            </button>
          )}
        </div>

        {/* More menu slide-up */}
        {moreOpen && (
          <div className="border-t border-zinc-200 bg-white px-4 py-3 space-y-1">
            {moreLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMoreOpen(false)}
                className={`block rounded-lg px-3 py-2.5 text-sm transition-colors ${
                  isActive(link.href) ? "bg-zinc-100 font-medium text-zinc-800" : "text-zinc-600 hover:bg-zinc-50"
                }`}
              >
                {link.label}
              </Link>
            ))}
          </div>
        )}
      </nav>
    </div>
  );
}
