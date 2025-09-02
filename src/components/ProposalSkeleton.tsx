export default function ProposalSkeleton() {
  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-100">
      <div className="mx-auto max-w-6xl px-4 py-8">
        <div className="grid gap-6 md:grid-cols-[1fr,320px]">
          {/* Main content skeleton */}
          <div className="space-y-6">
            {/* Title skeleton */}
            <div className="animate-pulse">
              <div className="h-8 bg-neutral-800 rounded-lg w-3/4 mb-4"></div>
              <div className="h-4 bg-neutral-800 rounded w-1/2 mb-6"></div>
            </div>

            {/* Description skeleton */}
            <div className="animate-pulse space-y-3">
              <div className="h-4 bg-neutral-800 rounded w-full"></div>
              <div className="h-4 bg-neutral-800 rounded w-5/6"></div>
              <div className="h-4 bg-neutral-800 rounded w-4/6"></div>
            </div>

            {/* Details section skeleton */}
            <div className="animate-pulse space-y-3 mt-8">
              <div className="h-5 bg-neutral-800 rounded w-1/4 mb-4"></div>
              <div className="space-y-2">
                <div className="h-4 bg-neutral-800 rounded w-full"></div>
                <div className="h-4 bg-neutral-800 rounded w-full"></div>
                <div className="h-4 bg-neutral-800 rounded w-3/4"></div>
                <div className="h-4 bg-neutral-800 rounded w-5/6"></div>
                <div className="h-4 bg-neutral-800 rounded w-4/5"></div>
              </div>
            </div>

            {/* Author and metadata skeleton */}
            <div className="animate-pulse flex items-center gap-4 pt-6 border-t border-neutral-800">
              <div className="w-10 h-10 bg-neutral-800 rounded-full"></div>
              <div className="space-y-2">
                <div className="h-3 bg-neutral-800 rounded w-24"></div>
                <div className="h-3 bg-neutral-800 rounded w-32"></div>
              </div>
            </div>
          </div>

          {/* Sidebar skeleton */}
          <aside className="space-y-4">
            {/* Voting card skeleton */}
            <div className="animate-pulse rounded-2xl border border-neutral-800 bg-neutral-950/40 p-6">
              <div className="h-6 bg-neutral-800 rounded w-3/4 mb-4"></div>
              <div className="space-y-3">
                <div className="h-12 bg-neutral-800 rounded-xl"></div>
                <div className="h-12 bg-neutral-800 rounded-xl"></div>
              </div>
            </div>

            {/* Stats skeleton */}
            <div className="animate-pulse rounded-2xl border border-neutral-800 bg-neutral-950/40 p-6">
              <div className="h-5 bg-neutral-800 rounded w-1/2 mb-4"></div>
              <div className="space-y-3">
                <div className="h-3 bg-neutral-800 rounded w-full"></div>
                <div className="h-6 bg-neutral-800 rounded-full"></div>
                <div className="flex justify-between">
                  <div className="h-3 bg-neutral-800 rounded w-1/3"></div>
                  <div className="h-3 bg-neutral-800 rounded w-1/3"></div>
                </div>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
