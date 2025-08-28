import type { Proposal } from "../types";
import { Link } from "@tanstack/react-router";
import {
  formatDate,
  shareUrl,
  isProposalOpen,
  calculateVotingPercentages,
} from "../utils";
import AuthorChip from "./AuthorChip";
import StatusPill from "./StatusPill";
import RelativeTime from "./RelativeTime";

interface ProposalCardProps {
  proposal: Proposal;
}

export default function ProposalCard({ proposal }: ProposalCardProps) {
  const open = isProposalOpen(proposal.deadline);
  const url = `${window.location.origin}/proposal/${proposal.id}`;
  const { yesPct } = calculateVotingPercentages(proposal.yes, proposal.no);

  return (
    <li className="group rounded-4xl bg-neutral-800/50 hover:border-neutral-700 transition relative">
      <Link
        to="/proposal/$id"
        params={{ id: proposal.id.toString() }}
        className="block p-4 md:p-6"
      >
        <div className="flex items-start gap-3 pr-10">
          <div className="w-full">
            {/* author chip */}
            <AuthorChip author={proposal.author} className="mb-2" />
            <div className="flex items-start gap-2 w-full">
              <h3 className="font-medium transition-colors text-gray-200 text-lg md:text-xl">
                {proposal.title}
              </h3>
              {/* open/closed pill */}
              <StatusPill isOpen={open} className="ml-auto" />
            </div>

            <p className="mt-1 text-sm text-neutral-300 line-clamp-2 leading-wide">
              {proposal.description}
            </p>
            <p className="text-sm text-neutral-400 mt-2">
              <RelativeTime date={proposal.createdAt} />
            </p>

            {/* meta row */}
            <div className="mt-3 flex flex-wrap items-center gap-3 text-xs text-neutral-400">
              {/* <span>#{proposal.id}</span> */}

              <span>Deadline {formatDate(proposal.deadline)}</span>
              <span>
                Yes {proposal.yes} • No {proposal.no}
              </span>
            </div>

            {/* progress bar */}
            <div className="mt-3 h-2 w-full rounded-full bg-neutral-900 border-none overflow-hidden">
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
          e.preventDefault();
          shareUrl(url, `Vote on: ${proposal.title}`);
        }}
        className="absolute top-4 right-4 md:top-6 md:right-6 rounded-xl border border-neutral-800 bg-neutral-900 p-2 text-neutral-300 hover:bg-neutral-800 opacity-0 group-hover:opacity-100 transition-opacity"
        title="Share"
      >
        <svg
          width="18"
          height="18"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M4 12v7a1 1 0 001 1h7M20 12V5a1 1 0 00-1-1h-7M20 4l-9 9M4 20l9-9"
          />
        </svg>
      </button>
    </li>
  );
}
