import type { Proposal } from '../types'
import ProposalCard from './ProposalCard'
import Pagination from './Pagination'

interface ProposalsListProps {
  proposals: Proposal[]
  currentPage: number
  totalPages: number
  onPageChange: (page: number) => void
  filterType?: 'all' | 'my'
  searchQuery?: string
}

export default function ProposalsList({ 
  proposals, 
  currentPage, 
  totalPages, 
  onPageChange,
  filterType = 'all',
  searchQuery = ''
}: ProposalsListProps) {
  return (
    <div className="space-y-4">
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
    </div>
  )
}
