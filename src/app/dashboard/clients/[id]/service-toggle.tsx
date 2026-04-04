"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";

export function ServiceToggle({ serviceId, enabled }: { serviceId: string; enabled: boolean }) {
  const [on, setOn] = useState(enabled);
  const [loading, setLoading] = useState(false);
  const supabase = createClient();
  const router = useRouter();

  async function toggle() {
    setLoading(true);
    const newVal = !on;
    const { error } = await supabase.from("client_services").update({ enabled: newVal }).eq("id", serviceId);
    if (!error) {
      setOn(newVal);
      router.refresh();
    }
    setLoading(false);
  }

  return (
    <button
      onClick={toggle}
      disabled={loading}
      className={`rounded-full px-3 py-1 text-xs font-medium transition-colors ${on ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400" : "bg-zinc-100 text-zinc-500 dark:bg-zinc-800 dark:text-zinc-400"}`}
    >
      {on ? "Enabled" : "Disabled"}
    </button>
  );
}
