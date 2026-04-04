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
      className="rounded-md bg-zinc-900 px-3 py-1.5 text-xs font-medium text-white transition-colors hover:bg-zinc-800 disabled:opacity-50 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-200"
    >
      {loading ? "Converting..." : "Convert to Client"}
    </button>
  );
}
