"use client";

import { useState } from "react";
import { updateSequence } from "./sequence-actions";
import { useRouter } from "next/navigation";
import { useToast } from "../components/toast";
import { SectionLabel } from "../components/ui";

interface Sequence {
  id: number;
  name: string;
  step1_subject: string | null;
  step1_body: string | null;
  step2_subject: string | null;
  step2_body: string | null;
  step3_subject: string | null;
  step3_body: string | null;
  active: boolean | null;
}

export function SequenceVariants({ sequences }: { sequences: Sequence[] }) {
  const { toast } = useToast();
  const router = useRouter();

  function handleCopy(seq: Sequence) {
    const text = [
      `=== ${seq.name} ===`,
      "",
      `--- Step 1 ---`,
      `Subject: ${seq.step1_subject || ""}`,
      seq.step1_body || "",
      "",
      `--- Step 2 ---`,
      `Subject: ${seq.step2_subject || ""}`,
      seq.step2_body || "",
      "",
      `--- Step 3 ---`,
      `Subject: ${seq.step3_subject || ""}`,
      seq.step3_body || "",
    ].join("\n");
    navigator.clipboard.writeText(text).then(
      () => toast("Sequence copied to clipboard", "success"),
      () => toast("Failed to copy", "error")
    );
  }

  return (
    <div>
      <SectionLabel>Email Sequences</SectionLabel>
      <div className="mt-3 space-y-4">
        {sequences.map((seq) => (
          <SequenceCard key={seq.id} sequence={seq} onCopy={() => handleCopy(seq)} toast={toast} onUpdate={() => router.refresh()} />
        ))}
        {sequences.length === 0 && (
          <p className="py-4 text-center text-sm text-zinc-400">No sequences configured. Run the migration to seed Variant A.</p>
        )}
      </div>
    </div>
  );
}

function SequenceCard({ sequence: seq, onCopy, toast, onUpdate }: {
  sequence: Sequence;
  onCopy: () => void;
  toast: (msg: string, type: "success" | "error" | "info") => void;
  onUpdate: () => void;
}) {
  const [expanded, setExpanded] = useState(false);

  async function saveField(field: string, value: string) {
    const result = await updateSequence(seq.id, { [field]: value });
    if (result.success) toast("Saved", "success");
    else toast(result.message, "error");
    onUpdate();
  }

  const inputClasses = "w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-900 placeholder-zinc-400 focus:border-zinc-400 focus:outline-none";

  return (
    <div className="rounded-lg border border-zinc-200 bg-white">
      <div className="flex items-center justify-between px-4 py-3">
        <button onClick={() => setExpanded(!expanded)} className="flex items-center gap-3 text-left">
          <span className="text-zinc-300">{expanded ? "▲" : "▼"}</span>
          <span className="text-sm font-medium text-zinc-900">{seq.name}</span>
          {seq.active && (
            <span className="rounded-full border border-emerald-200 bg-emerald-50 px-2 py-0.5 text-[10px] font-medium text-emerald-700">Active</span>
          )}
        </button>
        <button onClick={onCopy} className="rounded-md border border-zinc-300 bg-white px-3 py-1.5 text-xs font-semibold text-zinc-700 hover:bg-zinc-50 transition-colors">
          Copy Sequence
        </button>
      </div>

      {expanded && (
        <div className="border-t border-zinc-200 p-4 space-y-5">
          {([
            { step: 1, subjectField: "step1_subject", bodyField: "step1_body", subject: seq.step1_subject, body: seq.step1_body },
            { step: 2, subjectField: "step2_subject", bodyField: "step2_body", subject: seq.step2_subject, body: seq.step2_body },
            { step: 3, subjectField: "step3_subject", bodyField: "step3_body", subject: seq.step3_subject, body: seq.step3_body },
          ] as const).map((s) => (
            <div key={s.step}>
              <label className="mb-1.5 block text-[10px] font-semibold uppercase tracking-wider text-zinc-500">Step {s.step}</label>
              <input
                defaultValue={s.subject || ""}
                onBlur={(e) => { if (e.target.value !== (s.subject || "")) saveField(s.subjectField, e.target.value); }}
                className={inputClasses}
                placeholder={`Step ${s.step} subject line...`}
              />
              <textarea
                defaultValue={s.body || ""}
                onBlur={(e) => { if (e.target.value !== (s.body || "")) saveField(s.bodyField, e.target.value); }}
                rows={6}
                className={`mt-2 ${inputClasses}`}
                placeholder={`Step ${s.step} body...`}
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
