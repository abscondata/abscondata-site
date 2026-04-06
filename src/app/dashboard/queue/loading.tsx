export default function QueueLoading() {
  return (
    <div className="animate-pulse">
      {/* Header */}
      <div className="mb-5 flex items-center gap-3">
        <div className="h-7 w-32 rounded bg-zinc-200" />
        <div className="h-8 w-24 rounded-lg bg-zinc-200" />
      </div>

      {/* Filter tabs */}
      <div className="mb-5 flex gap-4 border-b border-zinc-200 pb-2">
        {[1, 2, 3, 4, 5].map((i) => (
          <div key={i} className="h-4 w-16 rounded bg-zinc-200" />
        ))}
      </div>

      {/* Task rows */}
      <div className="space-y-1.5">
        {[1, 2, 3, 4, 5].map((i) => (
          <div key={i} className="flex items-center justify-between rounded-lg border border-zinc-200 bg-white px-4 py-3">
            <div className="flex items-center gap-3">
              <div className="h-5 w-16 rounded-full bg-zinc-200" />
              <div className="h-4 w-20 rounded bg-zinc-200" />
              <div className="h-4 w-48 rounded bg-zinc-200" />
            </div>
            <div className="h-3 w-8 rounded bg-zinc-200" />
          </div>
        ))}
      </div>
    </div>
  );
}
