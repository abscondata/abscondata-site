"use client";

import { useState } from "react";
import { updatePlatformUrl } from "./actions";
import { useToast } from "../../components/toast";

export function PlatformUrl({ platformId, initialUrl }: { platformId: string; initialUrl: string }) {
  const [url, setUrl] = useState(initialUrl);
  const [editing, setEditing] = useState(false);
  const { toast } = useToast();

  async function handleBlur() {
    setEditing(false);
    if (url === initialUrl) return;
    const result = await updatePlatformUrl(platformId, url);
    if (!result.success) {
      toast(result.message, "error");
    }
  }

  if (editing) {
    return (
      <input
        value={url}
        onChange={(e) => setUrl(e.target.value)}
        onBlur={handleBlur}
        autoFocus
        placeholder="https://..."
        className="ml-2 w-48 rounded border border-zinc-300 bg-white px-2 py-0.5 text-xs text-zinc-700 placeholder-zinc-400 focus:border-zinc-400 focus:outline-none"
      />
    );
  }

  if (url) {
    return (
      <span className="ml-2 inline-flex items-center gap-1">
        <a href={url} target="_blank" rel="noopener noreferrer" className="text-xs text-blue-600 hover:text-blue-700 hover:underline">Open</a>
        <button onClick={() => setEditing(true)} className="text-[10px] text-zinc-400 hover:text-zinc-600">edit</button>
      </span>
    );
  }

  return (
    <button onClick={() => setEditing(true)} className="ml-2 text-[10px] text-zinc-400 hover:text-zinc-600">+ add URL</button>
  );
}
