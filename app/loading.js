export default function Loading() {
  return (
    <div aria-busy="true" aria-label="Loading products">
      <div className="mb-8 h-12 w-2/3 animate-pulse rounded-xl bg-mist" />
      <div className="mb-6 h-11 w-full animate-pulse rounded-xl bg-mist" />
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className="overflow-hidden rounded-2xl bg-white ring-1 ring-mist">
            <div className="aspect-square animate-pulse bg-mist" />
            <div className="space-y-3 p-4">
              <div className="h-4 w-4/5 animate-pulse rounded bg-mist" />
              <div className="h-4 w-1/3 animate-pulse rounded bg-mist" />
              <div className="h-10 animate-pulse rounded-xl bg-mist" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
