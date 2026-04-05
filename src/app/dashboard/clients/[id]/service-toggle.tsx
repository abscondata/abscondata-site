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
      className={`rounded-full border px-3 py-1 text-xs font-semibold transition-colors ${
        on
          ? "border-emerald-200 bg-emerald-50 text-emerald-700"
          : "border-zinc-200 bg-zinc-50 text-zinc-500"
      }`}
    >
      {on ? "Enabled" : "Disabled"}
    </button>
  );
}
