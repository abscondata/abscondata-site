"use client";

import { useState } from "react";
import { markSopReviewed, setClientActive } from "./actions";
import { useRouter } from "next/navigation";
import { useToast } from "../../components/toast";

interface Props {
  clientId: number;
  clientStatus: string;
  hasContactInfo: boolean;
  hasServices: boolean;
  credentialsReceived: boolean;
  allPlatformsConnected: boolean;
  hasFirstTasks: boolean;
  sopReviewed: boolean;
  platformCount: number;
}

export function OnboardingChecklist({
  clientId,
  clientStatus,
  hasContactInfo,
  hasServices,
  credentialsReceived,
  allPlatformsConnected,
  hasFirstTasks,
  sopReviewed: initialSopReviewed,
  platformCount,
}: Props) {
  const [sopReviewed, setSopReviewed] = useState(initialSopReviewed);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { toast } = useToast();

  const items = [
    { label: "Client information complete", done: hasContactInfo },
    { label: "Services selected", done: hasServices },
    { label: "Credentials received", done: platformCount === 0 || credentialsReceived },
    { label: "Platforms connected", done: platformCount === 0 || allPlatformsConnected },
    { label: "First tasks created", done: hasFirstTasks },
    { label: "SOP reviewed", done: sopReviewed, toggle: true },
  ];

  const completedCount = items.filter((i) => i.done).length;
  const allComplete = completedCount === items.length;
  const isActive = clientStatus === "active";

  // Don't show if client is active and all items are done
  if (isActive && allComplete) return null;

  async function handleSopToggle() {
    const newValue = !sopReviewed;
    setSopReviewed(newValue);
    const result = await markSopReviewed(clientId, newValue);
    if (!result.success) {
      setSopReviewed(!newValue);
      toast(result.message, "error");
    }
  }

  async function handleMarkActive() {
    setLoading(true);
    const result = await setClientActive(clientId);
    if (result.success) {
      toast("Client marked as active", "success");
      router.refresh();
    } else {
      toast(result.message, "error");
    }
    setLoading(false);
  }

  return (
    <section className="rounded-lg border border-amber-200 bg-amber-50 p-5">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-[10px] font-semibold uppercase tracking-wider text-amber-700">Onboarding Checklist</h3>
        <span className="text-xs font-semibold text-amber-700">{completedCount} of {items.length} complete</span>
      </div>

      {/* Progress bar */}
      <div className="mb-4 h-1.5 w-full rounded-full bg-amber-200">
        <div
          className="h-1.5 rounded-full bg-amber-600 transition-all"
          style={{ width: `${(completedCount / items.length) * 100}%` }}
        />
      </div>

      <div className="space-y-2">
        {items.map((item) => (
          <div key={item.label} className="flex items-center gap-3">
            {item.toggle ? (
              <button
                onClick={handleSopToggle}
                className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full border text-xs ${
                  item.done
                    ? "border-emerald-400 bg-emerald-500 text-white"
                    : "border-zinc-300 bg-white text-transparent hover:border-zinc-400"
                }`}
              >
                {item.done ? "✓" : ""}
              </button>
            ) : (
              <span className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full border text-xs ${
                item.done
                  ? "border-emerald-400 bg-emerald-500 text-white"
                  : "border-zinc-300 bg-white"
              }`}>
                {item.done ? "✓" : ""}
              </span>
            )}
            <span className={`text-sm ${item.done ? "text-zinc-700" : "text-zinc-500"}`}>{item.label}</span>
          </div>
        ))}
      </div>

      {allComplete && !isActive && (
        <div className="mt-4 rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-3 flex items-center justify-between">
          <span className="text-sm font-medium text-emerald-800">Onboarding complete</span>
          <button
            onClick={handleMarkActive}
            disabled={loading}
            className="rounded-lg bg-emerald-600 px-4 py-1.5 text-xs font-semibold text-white hover:bg-emerald-700 disabled:opacity-50 transition-colors"
          >
            {loading ? "..." : "Mark Client Active"}
          </button>
        </div>
      )}
    </section>
  );
}
