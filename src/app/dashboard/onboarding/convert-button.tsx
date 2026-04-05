"use client";

import { useState } from "react";
import { convertSubmission } from "./actions";
import { useRouter } from "next/navigation";

export function ConvertButton({ submissionId }: { submissionId: string }) {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function handleConvert() {
    setLoading(true);
    try {
      const result = await convertSubmission(submissionId);
      router.push(`/dashboard/clients/${result.clientId}`);
    } catch (err) {
      alert(err instanceof Error ? err.message : "Conversion failed");
      setLoading(false);
    }
  }

  return (
    <button
      onClick={handleConvert}
      disabled={loading}
      className="rounded-lg bg-zinc-900 px-4 py-2 text-xs font-semibold text-white hover:bg-zinc-800 disabled:opacity-50 transition-colors"
    >
      {loading ? "Converting..." : "Convert to Client"}
    </button>
  );
}
