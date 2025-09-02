export default function ProposalsListSkeleton() {
  return (
    <div className="space-y-4">
      {/* Proposals grid skeleton */}
      <ul className="grid gap-4">
        {Array.from({ length: 6 }).map((_, index) => (
          <li key={index} className="animate-pulse rounded-3xl bg-neutral-900/50 border border-neutral-800">
            <div className="p-6 space-y-4">
              {/* Header section */}
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 space-y-3">
                  <div className="h-6 bg-neutral-800 rounded w-3/4"></div>
                  <div className="space-y-2">
                    <div className="h-4 bg-neutral-800 rounded w-full"></div>
                    <div className="h-4 bg-neutral-800 rounded w-5/6"></div>
                  </div>
                </div>
                <div className="h-10 w-10 bg-neutral-800 rounded-xl"></div>
              </div>

              {/* Metadata pills */}
              <div className="flex flex-wrap items-center gap-2">
                <div className="h-6 bg-neutral-800 rounded-full w-24"></div>
                <div className="h-6 bg-neutral-800 rounded-full w-20"></div>
                <div className="h-6 bg-neutral-800 rounded-full w-28"></div>
              </div>

              {/* Voting stats */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="h-4 bg-neutral-800 rounded w-24"></div>
                  <div className="h-4 bg-neutral-800 rounded w-16"></div>
                </div>
                
                {/* Progress bar */}
                <div className="h-3 bg-neutral-800 rounded-full w-full"></div>
                
                {/* Vote breakdown */}
                <div className="flex items-center justify-between">
                  <div className="h-3 bg-neutral-800 rounded w-20"></div>
                  <div className="h-3 bg-neutral-800 rounded w-20"></div>
                </div>
              </div>
            </div>
          </li>
        ))}
      </ul>

      {/* Pagination skeleton */}
      <div className="flex justify-center">
        <div className="animate-pulse">
          <div className="h-10 bg-neutral-800 rounded w-32"></div>
        </div>
      </div>
    </div>
  );
}
