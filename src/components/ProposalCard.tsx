import type { Proposal } from '../types'
import { Link } from "@tanstack/react-router"
import { formatDate, shareUrl, isProposalOpen, calculateVotingPercentages } from '../utils'

interface ProposalCardProps {
  proposal: Proposal
}

export default function ProposalCard({ proposal }: ProposalCardProps) {
  const open = isProposalOpen(proposal.deadline)
  const url = `${window.location.origin}/proposal/${proposal.id}`
  const { yesPct } = calculateVotingPercentages(proposal.yes, proposal.no)

  return (
    <li className="group rounded-2xl border border-neutral-800 bg-neutral-950/40 hover:border-neutral-700 transition relative">
      <Link to="/proposal/$id" params={{ id: proposal.id.toString() }} className="block p-4 md:p-6">
        <div className="flex items-start gap-3 pr-10">
          {/* author chip */}
          <div className="shrink-0 rounded-full border border-neutral-800 bg-neutral-900 px-3 py-1 text-xs text-neutral-300">
            {proposal.author}
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-start gap-2">
              <h3 className="font-medium leading-snug group-hover:text-neutral-50 transition-colors">{proposal.title}</h3>
              {/* open/closed pill */}
              <span
                className={`ml-auto text-xs px-2 py-1 rounded-full border ${
                  open
                    ? "border-emerald-700/50 bg-emerald-900/20 text-emerald-300"
                    : "border-neutral-700 bg-neutral-900 text-neutral-400"
                }`}
              >
                {open ? "open" : "closed"}
              </span>
            </div>

            <p className="mt-1 text-sm text-neutral-300 line-clamp-2">
              {proposal.description}
            </p>

            {/* meta row */}
            <div className="mt-3 flex flex-wrap items-center gap-3 text-xs text-neutral-400">
              <span>#{proposal.id}</span>
              <span>Created: {formatDate(proposal.createdAt)}</span>
              <span>Deadline: {formatDate(proposal.deadline)}</span>
              <span>Yes {proposal.yes} • No {proposal.no}</span>
            </div>

            {/* progress bar */}
            <div className="mt-3 h-2 w-full rounded-full bg-neutral-900 border border-neutral-800 overflow-hidden">
              <div
                className="h-full bg-emerald-500 transition-[width] duration-500"
                style={{ width: `${yesPct}%` }}
                title={`${yesPct}% yes`}
              />
            </div>
          </div>
        </div>
      </Link>

      {/* share button - outside of link to prevent nested interaction */}
      <button
        onClick={(e) => {
          e.preventDefault()
          shareUrl(url, `Vote on: ${proposal.title}`)
        }}
        className="absolute top-4 right-4 md:top-6 md:right-6 rounded-xl border border-neutral-800 bg-neutral-900 p-2 text-neutral-300 hover:bg-neutral-800 opacity-0 group-hover:opacity-100 transition-opacity"
        title="Share"
      >
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
            d="M4 12v7a1 1 0 001 1h7M20 12V5a1 1 0 00-1-1h-7M20 4l-9 9M4 20l9-9" />
        </svg>
      </button>
    </li>
  )
}
