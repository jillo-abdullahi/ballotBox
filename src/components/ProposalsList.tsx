import type { Proposal } from '../types'
import ProposalCard from './ProposalCard'
import Pagination from './Pagination'

interface ProposalsListProps {
  proposals: Proposal[]
  totalCount: number
  currentPage: number
  totalPages: number
  onPageChange: (page: number) => void
}

export default function ProposalsList({ 
  proposals, 
  totalCount, 
  currentPage, 
  totalPages, 
  onPageChange 
}: ProposalsListProps) {
  return (
    <section className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-medium">Recent proposals</h2>
        <span className="text-sm text-neutral-400">{totalCount} found</span>
      </div>

      <ul className="grid gap-4">
        {proposals.map((proposal) => (
          <ProposalCard key={proposal.id} proposal={proposal} />
        ))}
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
