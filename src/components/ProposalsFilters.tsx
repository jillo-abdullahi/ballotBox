import { useAccount } from 'wagmi';

export type FilterType = 'all' | 'my';

interface ProposalsFiltersProps {
  filterType: FilterType;
  onFilterTypeChange: (filter: FilterType) => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
}

export default function ProposalsFilters({
  filterType,
  onFilterTypeChange,
  searchQuery,
  onSearchChange,
}: ProposalsFiltersProps) {
  const { isConnected } = useAccount();

  return (
    <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
      {/* Filter Dropdown */}
      <div className="relative">
        <select
          value={filterType}
          onChange={(e) => onFilterTypeChange(e.target.value as FilterType)}
          className="appearance-none bg-neutral-900 border border-neutral-700 rounded-xl px-3 py-2 pr-8 text-sm text-neutral-100 focus:outline-none focus:ring-2 focus:ring-blue-text focus:border-transparent cursor-pointer min-w-[140px] w-full sm:w-auto"
          disabled={!isConnected && filterType === 'my'}
        >
          <option value="all">All Proposals</option>
          <option value="my" disabled={!isConnected}>
            My Proposals {!isConnected && '(Connect Wallet)'}
          </option>
        </select>
        
        {/* Custom dropdown arrow */}
        <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
          <svg
            className="w-4 h-4 text-neutral-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 9l-7 7-7-7"
            />
          </svg>
        </div>
      </div>

      {/* Search Field */}
      <div className="relative w-full sm:w-64">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <svg
            className="h-4 w-4 text-neutral-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
        </div>
        <input
          type="text"
          placeholder="Search proposals..."
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          className="w-full pl-10 pr-10 py-2 text-sm bg-neutral-900 border border-neutral-700 rounded-xl text-neutral-100 placeholder-neutral-500 focus:outline-none focus:ring-2 focus:ring-blue-text focus:border-transparent"
        />
        
        {/* Clear search button */}
        {searchQuery && (
          <button
            onClick={() => onSearchChange('')}
            className="absolute inset-y-0 right-0 pr-3 flex items-center text-neutral-400 hover:text-neutral-200 transition-colors"
          >
            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        )}
      </div>
    </div>
  );
}
