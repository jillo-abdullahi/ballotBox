import type { Proposal } from '../types'
import ProposalCard from './ProposalCard'
import Pagination from './Pagination'
import ProposalsFilters, { type FilterType } from './ProposalsFilters'

interface ProposalsListProps {
  proposals: Proposal[]
  totalCount: number
  currentPage: number
  totalPages: number
  onPageChange: (page: number) => void
  filterType: FilterType
  onFilterTypeChange: (filter: FilterType) => void
  searchQuery: string
  onSearchChange: (query: string) => void
}

export default function ProposalsList({ 
  proposals, 
  totalCount, 
  currentPage, 
  totalPages, 
  onPageChange,
  filterType,
  onFilterTypeChange,
  searchQuery,
  onSearchChange
}: ProposalsListProps) {
  return (
    <section className="space-y-4">
      {/* Header with title and filters */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <h2 className="text-lg font-medium">
          {filterType === 'my' ? 'My proposals' : 'Recent proposals'}
        </h2>
        
        {/* Filters */}
        <div className="flex justify-end">
          <ProposalsFilters
            filterType={filterType}
            onFilterTypeChange={onFilterTypeChange}
            searchQuery={searchQuery}
            onSearchChange={onSearchChange}
          />
        </div>
      </div>

      {/* Count display - more prominent */}
      <div className="flex items-center">
        <span className="text-sm font-medium text-blue-text bg-blue-bg px-3 py-1.5 rounded-xl border border-blue-text/10">
          {totalCount} {totalCount === 1 ? 'proposal' : 'proposals'} found
        </span>
      </div>

      <ul className="grid gap-4">
        {proposals.length > 0 ? (
          proposals.map((proposal) => (
            <ProposalCard key={proposal.id} proposal={proposal} />
          ))
        ) : (
          <div className="rounded-2xl border border-neutral-800 bg-neutral-950/40 p-8 text-center">
            <p className="text-neutral-400">
              {searchQuery 
                ? `No proposals found matching "${searchQuery}"`
                : filterType === 'my' 
                  ? "You haven't created any proposals yet." 
                  : "No proposals found."
              }
            </p>
            {filterType === 'my' && !searchQuery && (
              <p className="text-sm text-neutral-500 mt-2">
                Create your first proposal to get started!
              </p>
            )}
          </div>
        )}
      </ul>

      {totalPages > 1 && (
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={onPageChange}
        />
      )}
    </section>
  )
}
