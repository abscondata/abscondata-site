"use client";

import { useState } from "react";
import { updateClientNotes } from "./actions";
import { useToast } from "../../components/toast";

export function ClientNotes({ clientId, initialNotes }: { clientId: number; initialNotes: string }) {
  const [notes, setNotes] = useState(initialNotes);
  const [saving, setSaving] = useState(false);
  const { toast } = useToast();

  async function handleBlur() {
    if (notes === initialNotes) return;
    setSaving(true);
    const result = await updateClientNotes(clientId, notes);
    if (result.success) {
      toast("Notes saved", "success");
    } else {
      toast(result.message, "error");
    }
    setSaving(false);
  }

  return (
    <div>
      <div className="mb-2 flex items-center gap-2">
        <h3 className="text-[10px] font-semibold uppercase tracking-wider text-zinc-500">Notes</h3>
        {saving && <span className="text-[10px] text-zinc-400">Saving...</span>}
      </div>
      <textarea
        value={notes}
        onChange={(e) => setNotes(e.target.value)}
        onBlur={handleBlur}
        rows={3}
        className="w-full rounded-lg border border-zinc-300 bg-white px-3 py-2.5 text-sm text-zinc-900 placeholder-zinc-400 focus:border-zinc-400 focus:outline-none"
        placeholder="Client preferences, special instructions, things the VA needs to know..."
      />
    </div>
  );
}
