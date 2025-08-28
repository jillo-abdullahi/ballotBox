import { Link } from "@tanstack/react-router"
import type { Proposal } from '../types'
import { formatDate, shareUrl, isProposalOpen, calculateVotingPercentages } from '../utils'
import AuthorChip from './AuthorChip'
import StatusPill from './StatusPill'
import RelativeTime from './RelativeTime'

interface MyProposalCardProps {
  proposal: Proposal
}

export default function MyProposalCard({ proposal }: MyProposalCardProps) {
  const open = isProposalOpen(proposal.deadline)
  const url = `${window.location.origin}/proposal/${proposal.id}`
  const { yesPct } = calculateVotingPercentages(proposal.yes, proposal.no)

  return (
    <li className="group rounded-2xl border border-neutral-800 bg-neutral-950/40 p-4 md:p-5 hover:border-neutral-700 transition">
      <div className="flex items-start gap-3">
        <AuthorChip author={proposal.author} />
        <div className="flex-1 min-w-0">
          <div className="flex items-start gap-2">
            <h3 className="font-medium leading-snug">{proposal.title}</h3>
            <StatusPill isOpen={open} className="ml-auto" />
          </div>

          <p className="mt-1 text-sm text-neutral-300 line-clamp-2">
            {proposal.description}
          </p>

          <div className="mt-3 flex flex-wrap items-center gap-3 text-xs text-neutral-400">
            <span>#{proposal.id}</span>
            <RelativeTime date={proposal.createdAt} />
            <span>Deadline: {formatDate(proposal.deadline)}</span>
            <span>Yes {proposal.yes} • No {proposal.no}</span>
          </div>

          <div className="mt-3 h-2 w-full rounded-full bg-neutral-900 border border-neutral-800 overflow-hidden">
            <div
              className="h-full bg-emerald-500 transition-[width] duration-500"
              style={{ width: `${yesPct}%` }}
              title={`${yesPct}% yes`}
            />
          </div>

          <div className="mt-3 flex gap-2">
            <Link
              to="/proposal/$id"
              params={{ id: String(proposal.id) }}
              className="rounded-lg border border-neutral-800 bg-neutral-900 px-3 py-2 text-sm hover:bg-neutral-800"
            >
              Open
            </Link>
            <button
              onClick={() => shareUrl(url, `Vote on: ${proposal.title}`)}
              className="rounded-lg border border-neutral-800 bg-neutral-900 px-3 py-2 text-sm hover:bg-neutral-800"
            >
              Share
            </button>
          </div>
        </div>
      </div>
    </li>
  )
}
