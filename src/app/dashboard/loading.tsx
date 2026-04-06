export default function DashboardLoading() {
  return (
    <div className="space-y-8 animate-pulse">
      {/* Greeting */}
      <div className="h-7 w-48 rounded bg-zinc-200" />

      {/* Stat cards */}
      <div className="grid grid-cols-3 gap-3">
        {[1, 2, 3].map((i) => (
          <div key={i} className="rounded-lg border border-zinc-200 bg-white p-4">
            <div className="h-8 w-16 rounded bg-zinc-200" />
            <div className="mt-2 h-3 w-24 rounded bg-zinc-200" />
          </div>
        ))}
      </div>

      {/* Quick action */}
      <div className="h-10 w-28 rounded-lg bg-zinc-200" />

      {/* Recent activity */}
      <div>
        <div className="mb-3 h-3 w-28 rounded bg-zinc-200" />
        <div className="overflow-hidden rounded-lg border border-zinc-200">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="flex items-center gap-4 px-4 py-3 border-b border-zinc-100 last:border-0">
              <div className="h-3 w-12 rounded bg-zinc-200" />
              <div className="h-3 w-24 rounded bg-zinc-200" />
              <div className="h-3 w-32 rounded bg-zinc-200 flex-1" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
