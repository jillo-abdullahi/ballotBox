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
import MetadataPill from "./MetadataPill";
import { TbHeartShare } from "react-icons/tb";

interface ProposalCardProps {
  proposal: Proposal;
}

export default function ProposalCard({ proposal }: ProposalCardProps) {
  const open = isProposalOpen(proposal.deadline);

  const url = `${window.location.origin}/proposal/${proposal.id}`;
  const { yesPct, noPct } = calculateVotingPercentages(
    proposal.yes,
    proposal.no
  );

  return (
    <li className="group rounded-3xl bg-teal-bg/50 hover:bg-teal-bg/60 transition-all duration-200 relative overflow-hidden border border-teal-text/10">
      <Link
        to="/proposal/$id"
        params={{ id: proposal.id.toString() }}
        className="block p-6"
      >
        <div className="space-y-4">
          {/* Header section with title and status */}
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-neutral-100 text-lg line-clamp-2">
                {proposal.title} <StatusPill isOpen={open} className="ml-2" />
              </h3>
              <p className="mt-2 text-neutral-300 text-sm line-clamp-2 leading-relaxed">
                {proposal.description}
              </p>
            </div>
            <button
              onClick={(e) => {
                e.preventDefault();
                shareUrl(url, `Vote on: ${proposal.title}`);
              }}
              className="cursor-pointer rounded-xl bg-neutral-800/50 p-2.5 text-neutral-400 hover:bg-neutral-700/50 hover:text-neutral-200 transition-all duration-200"
              title="Share"
            >
              <TbHeartShare size={20} className="text-neutral-200" />
            </button>
          </div>

          {/* Metadata pills */}
          <div className="flex flex-wrap items-center gap-2">
            <MetadataPill>
              <div className="flex items-center gap-2">
                <AuthorChip author={proposal.author} />
              </div>
            </MetadataPill>
            <MetadataPill>
              <span className="text-xs text-neutral-400 font-medium">
                <RelativeTime date={proposal.createdAt} />
              </span>
            </MetadataPill>
            <MetadataPill>
              <span className="text-xs text-neutral-400 font-medium">
                Ends {formatDate(proposal.deadline)}
              </span>
            </MetadataPill>
          </div>

          {/* Voting stats */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="text-neutral-200 font-medium">
                Current Results
              </span>
              <span className="text-neutral-400 font-medium">
                {proposal.yes + proposal.no} votes
              </span>
            </div>

            {/* Progress bar with dual colors */}
            <div className="h-3 w-full rounded-full bg-neutral-800/50 overflow-hidden flex">
              <div
                className="h-full bg-teal-text/50 transition-[width] duration-500"
                style={{ width: `${yesPct}%` }}
                title={`${yesPct}% yes (${proposal.yes} votes)`}
              />
              <div
                className="h-full bg-teal-text/10 transition-[width] duration-500"
                style={{ width: `${noPct}%` }}
                title={`${noPct}% no (${proposal.no} votes)`}
              />
            </div>

            {/* Vote breakdown */}
            <div className="flex items-center justify-between text-xs">
              <div className="flex items-center gap-1">
                <div className="w-2 h-2 rounded-full bg-teal-text/40"></div>
                <span className="text-neutral-300">
                  Yes: {proposal.yes} ({yesPct}%)
                </span>
              </div>
              <div className="flex items-center gap-1">
                <div className="w-2 h-2 rounded-full bg-teal-text/20"></div>
                <span className="text-neutral-300">
                  No: {proposal.no} ({noPct}%)
                </span>
              </div>
            </div>
          </div>
        </div>
      </Link>
    </li>
  );
}
