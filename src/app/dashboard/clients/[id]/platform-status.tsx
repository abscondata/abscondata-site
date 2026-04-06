"use client";

import { useState } from "react";
import { updatePlatformStatus } from "./actions";
import { useRouter } from "next/navigation";
import { useToast } from "../../components/toast";

const STATUS_OPTIONS = [
  { value: "not_connected", label: "Not Connected" },
  { value: "credentials_received", label: "Credentials Received" },
  { value: "connected", label: "Connected" },
  { value: "error", label: "Error" },
];

const STATUS_COLORS: Record<string, string> = {
  not_connected: "border-zinc-300 text-zinc-700",
  credentials_received: "border-amber-300 text-amber-700",
  connected: "border-emerald-300 text-emerald-700",
  error: "border-red-300 text-red-700",
};

export function PlatformStatusDropdown({ platformId, currentStatus }: { platformId: string; currentStatus: string }) {
  const [status, setStatus] = useState(currentStatus || "not_connected");
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { toast } = useToast();

  async function handleChange(newStatus: string) {
    setLoading(true);
    setStatus(newStatus);
    try {
      const result = await updatePlatformStatus(platformId, newStatus);
      if (result.success) {
        toast("Platform status updated", "success");
        router.refresh();
      } else {
        toast(result.message, "error");
        setStatus(currentStatus);
      }
    } catch {
      toast("Failed to update platform status", "error");
      setStatus(currentStatus);
    } finally {
      setLoading(false);
    }
  }

  return (
    <select
      value={status}
      onChange={(e) => handleChange(e.target.value)}
      disabled={loading}
      className={`rounded-full border px-2.5 py-0.5 text-xs font-medium bg-white focus:outline-none disabled:opacity-50 ${STATUS_COLORS[status] || STATUS_COLORS.not_connected}`}
    >
      {STATUS_OPTIONS.map((o) => (
        <option key={o.value} value={o.value}>{o.label}</option>
      ))}
    </select>
  );
}
