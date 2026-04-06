"use client";

import { useState } from "react";
import { convertSubmission, rejectSubmission } from "./actions";
import { useRouter } from "next/navigation";
import { useToast } from "../components/toast";

export function ConvertButton({ submissionId }: { submissionId: string }) {
  const [loading, setLoading] = useState(false);
  const [showReject, setShowReject] = useState(false);
  const router = useRouter();
  const { toast } = useToast();

  async function handleConvert() {
    setLoading(true);
    try {
      const result = await convertSubmission(submissionId);
      if (result.success && result.clientId) {
        toast("Submission converted to client", "success");
        router.push(`/dashboard/clients/${result.clientId}`);
      } else {
        toast(result.message, "error");
        setLoading(false);
      }
    } catch (err) {
      toast(err instanceof Error ? err.message : "Conversion failed", "error");
      setLoading(false);
    }
  }

  async function handleReject() {
    setLoading(true);
    try {
      const result = await rejectSubmission(submissionId);
      if (result.success) {
        toast("Submission rejected", "success");
        router.refresh();
      } else {
        toast(result.message, "error");
      }
    } catch (err) {
      toast(err instanceof Error ? err.message : "Reject failed", "error");
    } finally {
      setLoading(false);
      setShowReject(false);
    }
  }

  return (
    <div className="flex items-center gap-2">
      <button
        onClick={handleConvert}
        disabled={loading}
        className="rounded-lg bg-zinc-900 px-4 py-2 text-xs font-semibold text-white hover:bg-zinc-800 disabled:opacity-50 transition-colors"
      >
        {loading ? "..." : "Convert to Client"}
      </button>
      {!showReject ? (
        <button
          onClick={() => setShowReject(true)}
          disabled={loading}
          className="rounded-lg border border-zinc-300 bg-white px-3 py-2 text-xs font-semibold text-zinc-500 hover:bg-zinc-50 disabled:opacity-50 transition-colors"
        >
          Reject
        </button>
      ) : (
        <button
          onClick={handleReject}
          disabled={loading}
          className="rounded-lg bg-red-600 px-3 py-2 text-xs font-semibold text-white hover:bg-red-700 disabled:opacity-50 transition-colors"
        >
          {loading ? "..." : "Confirm Reject"}
        </button>
      )}
    </div>
  );
}
