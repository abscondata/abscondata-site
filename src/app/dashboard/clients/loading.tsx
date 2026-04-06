export default function ClientsLoading() {
  return (
    <div className="animate-pulse">
      {/* Header */}
      <div className="mb-5 flex items-center justify-between">
        <div className="h-7 w-24 rounded bg-zinc-200" />
        <div className="h-10 w-28 rounded-lg bg-zinc-200" />
      </div>

      {/* Table */}
      <div className="overflow-hidden rounded-lg border border-zinc-200">
        {/* Header row */}
        <div className="flex gap-4 border-b border-zinc-200 bg-zinc-50 px-4 py-2.5">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="h-3 w-16 rounded bg-zinc-200" />
          ))}
        </div>
        {/* Data rows */}
        {[1, 2, 3, 4, 5].map((i) => (
          <div key={i} className="flex items-center gap-4 border-b border-zinc-100 bg-white px-4 py-3 last:border-0">
            <div className="h-4 w-32 rounded bg-zinc-200" />
            <div className="h-4 w-20 rounded bg-zinc-200" />
            <div className="h-5 w-14 rounded-full bg-zinc-200" />
            <div className="h-4 w-28 rounded bg-zinc-200" />
            <div className="h-4 w-8 rounded bg-zinc-200" />
            <div className="h-2 w-2 rounded-full bg-zinc-200" />
          </div>
        ))}
      </div>
    </div>
  );
}
