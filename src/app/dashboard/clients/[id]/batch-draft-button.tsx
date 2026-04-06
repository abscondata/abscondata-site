"use client";

import { useState } from "react";
import { batchGenerateDrafts } from "./batch-ai";
import { useRouter } from "next/navigation";
import { useToast } from "../../components/toast";

export function BatchDraftButton({ clientId, eligibleCount }: { clientId: number; eligibleCount: number }) {
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState("");
  const router = useRouter();
  const { toast } = useToast();

  if (eligibleCount === 0) return null;

  async function handleClick() {
    setLoading(true);
    setProgress(`Generating drafts for ${eligibleCount} tasks...`);
    try {
      const result = await batchGenerateDrafts(clientId);
      if (result.success) {
        toast(result.message, "success");
        router.refresh();
      } else {
        toast(result.message, "error");
      }
    } catch (err) {
      toast(err instanceof Error ? err.message : "Batch generation failed", "error");
    } finally {
      setLoading(false);
      setProgress("");
    }
  }

  return (
    <div className="flex items-center gap-2">
      <button
        onClick={handleClick}
        disabled={loading}
        className="inline-flex items-center gap-1.5 rounded-lg border border-zinc-300 bg-white px-4 py-1.5 text-xs font-semibold text-zinc-700 hover:bg-zinc-50 disabled:opacity-50 transition-colors"
      >
        {loading && <span className="inline-block h-3 w-3 animate-spin rounded-full border-2 border-zinc-600 border-t-transparent" />}
        {loading ? progress : `Generate All Drafts (${eligibleCount})`}
      </button>
    </div>
  );
}
