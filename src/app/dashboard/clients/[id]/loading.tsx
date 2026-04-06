export default function ClientDetailLoading() {
  return (
    <div className="space-y-8 animate-pulse">
      {/* Back link + header */}
      <div>
        <div className="h-3 w-24 rounded bg-zinc-200" />
        <div className="mt-3 flex items-center gap-3">
          <div className="h-7 w-48 rounded bg-zinc-200" />
          <div className="h-5 w-14 rounded-full bg-zinc-200" />
        </div>
        <div className="mt-2 flex gap-4">
          <div className="h-4 w-28 rounded bg-zinc-200" />
          <div className="h-4 w-36 rounded bg-zinc-200" />
        </div>
      </div>

      {/* Services */}
      <div>
        <div className="mb-3 h-3 w-20 rounded bg-zinc-200" />
        <div className="space-y-2">
          {[1, 2, 3].map((i) => (
            <div key={i} className="flex items-center justify-between rounded-lg border border-zinc-200 bg-white px-4 py-3">
              <div className="h-4 w-32 rounded bg-zinc-200" />
              <div className="h-5 w-10 rounded-full bg-zinc-200" />
            </div>
          ))}
        </div>
      </div>

      {/* Active tasks */}
      <div>
        <div className="mb-3 h-3 w-28 rounded bg-zinc-200" />
        <div className="space-y-2">
          {[1, 2, 3].map((i) => (
            <div key={i} className="rounded-lg border border-zinc-200 bg-white px-4 py-3">
              <div className="flex items-center gap-2.5">
                <div className="h-5 w-20 rounded-full bg-zinc-200" />
                <div className="h-4 w-56 rounded bg-zinc-200" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
