import { MdLightbulb } from "react-icons/md";

import type { Proposal } from "../types";
import { formatDate, isProposalOpen } from "../utils";
import AuthorChip from "./AuthorChip";
import StatusPill from "./StatusPill";
import RelativeTime from "./RelativeTime";
import InfoPill from "./InfoPill";

interface ProposalContentProps {
  proposal: Proposal;
}

export default function ProposalContent({ proposal }: ProposalContentProps) {
  const open = isProposalOpen(proposal.deadline);

  return (
    <div className="space-y-6">
      {/* Info Section */}
      <section className="bg-teal-bg rounded-3xl p-8">
        <div className="flex justify-start items-center mb-4 space-x-1">
          <MdLightbulb className="text-lg text-teal-text/70" />
          <span className="text-lg text-teal-text/80 font-medium">
            Proposal #{proposal.id}
          </span>
        </div>
        <h1 className="text-3xl md:text-4xl font-bold text-teal-text mb-4">
          {proposal.title}
        </h1>
        <p className="text-lg text-teal-text mb-6">{proposal.description}</p>
        <div className="flex items-center justify-start gap-4 text-sm text-teal-text/80">
          <span>
            Created <RelativeTime date={proposal.createdAt} />
          </span>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mt-2">
          {/* Author Pill */}
          <InfoPill label="Author">
            <span className="text-sm text-teal-text font-semibold">
              {proposal.author}
            </span>
          </InfoPill>

          {/* Deadline Pill */}
          <InfoPill label="Deadline">
            <span className="text-sm text-teal-text font-semibold">
              {formatDate(proposal.deadline)}
            </span>
          </InfoPill>

          {/* Status Pill */}
          <InfoPill
            label="Status"
            bgColor={open ? "bg-teal-bg/50" : "bg-red-bg/50"}
            textColor={open ? "text-teal-text" : "text-red-text"}
          >
            <span
              className={`text-sm font-semibold ${
                open ? "text-teal-text" : "text-red-text"
              }`}
            >
              {open ? "Open" : "Closed"}
            </span>
          </InfoPill>
        </div>
        
      </section>

      {/* Proposal Details */}
      <article className="rounded-2xl border-none bg-neutral-950/40">
        <div className="space-y-4">
          {/* Info Pills */}

          {/* Additional Details */}
          {proposal.details && (
            <div className="pt-2">
              {/* <hr className="border-neutral-700 mb-6" /> */}
              <div className="bg-teal-bg/50 rounded-3xl p-8 whitespace-pre-line text-neutral-300">
                {proposal.details}
              </div>
            </div>
          )}
        </div>
      </article>
    </div>
  );
}
