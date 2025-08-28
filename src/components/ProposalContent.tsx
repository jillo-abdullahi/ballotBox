import type { Proposal } from '../types'
import { formatDate, isProposalOpen } from '../utils'
import AuthorChip from './AuthorChip'
import StatusPill from './StatusPill'
import RelativeTime from './RelativeTime'

interface ProposalContentProps {
  proposal: Proposal
}

export default function ProposalContent({ proposal }: ProposalContentProps) {
  const open = isProposalOpen(proposal.deadline)

  return (
    <article className="rounded-2xl border border-neutral-800 bg-neutral-950/40 p-5">
      <div className="flex items-start gap-3">
        <AuthorChip author={proposal.author} />
        <div className="flex-1 min-w-0">
          <h1 className="text-xl md:text-2xl font-semibold leading-tight">{proposal.title}</h1>
          <div className="mt-2 flex flex-wrap items-center gap-3 text-xs text-neutral-400">
            <span>#{proposal.id}</span>
            <RelativeTime date={proposal.createdAt} />
            <span>Deadline: {formatDate(proposal.deadline)}</span>
            <StatusPill isOpen={open} />
          </div>

          <h2 className="mt-5 text-sm uppercase tracking-wide text-neutral-400">Description</h2>
          <p className="mt-2 text-neutral-200">{proposal.description}</p>

          {proposal.details && (
            <>
              <h2 className="mt-6 text-sm uppercase tracking-wide text-neutral-400">Details</h2>
              <div className="mt-2 whitespace-pre-line text-neutral-200">
                {proposal.details}
              </div>
            </>
          )}
        </div>
      </div>
    </article>
  )
}
