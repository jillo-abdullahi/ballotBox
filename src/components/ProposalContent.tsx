import type { Proposal } from '../types'
import { formatDate, isProposalOpen } from '../utils'

interface ProposalContentProps {
  proposal: Proposal
}

export default function ProposalContent({ proposal }: ProposalContentProps) {
  const open = isProposalOpen(proposal.deadline)

  return (
    <article className="rounded-2xl border border-neutral-800 bg-neutral-950/40 p-5">
      <div className="flex items-start gap-3">
        <div className="shrink-0 rounded-full border border-neutral-800 bg-neutral-900 px-3 py-1 text-xs text-neutral-300">
          {proposal.author}
        </div>
        <div className="flex-1 min-w-0">
          <h1 className="text-xl md:text-2xl font-semibold leading-tight">{proposal.title}</h1>
          <div className="mt-2 flex flex-wrap items-center gap-3 text-xs text-neutral-400">
            <span>#{proposal.id}</span>
            <span>Created: {formatDate(proposal.createdAt)}</span>
            <span>Deadline: {formatDate(proposal.deadline)}</span>
            <span className={`px-2 py-0.5 rounded-full border ${
              open
                ? "border-emerald-700/50 bg-emerald-900/20 text-emerald-300"
                : "border-neutral-700 bg-neutral-900 text-neutral-400"
            }`}>{open ? "open" : "closed"}</span>
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
