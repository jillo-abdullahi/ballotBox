import { MdLightbulb } from "react-icons/md";

import type { Proposal } from "../types";
import { formatDate, isProposalOpen } from "../utils";
import RelativeTime from "./RelativeTime";
import InfoBox from "./InfoBox";
import AuthorChip from "./AuthorChip";
import StatusPill from "./StatusPill";

interface ProposalContentProps {
  proposal: Proposal;
}

export default function ProposalContent({ proposal }: ProposalContentProps) {
  const open = isProposalOpen(proposal.deadline);

  return (
    <article className="space-y-2">
      {/* Title and description section */}
      <header className="bg-teal-bg rounded-3xl p-8">
        <div className="flex justify-start items-center mb-4 space-x-1">
          <MdLightbulb
            className="text-lg text-neutral-300"
            aria-hidden="true"
          />
          <span className="text-lg text-neutral-300 font-medium">
            Proposal #{proposal.id}
          </span>

          <StatusPill isOpen={open} className="ml-2" />
        </div>
        <h1 className="text-3xl md:text-4xl font-bold text-neutral-300 mb-4">
          {proposal.title}
        </h1>
        <p className="text-lg text-neutral-300 mb-2">{proposal.description}</p>
      </header>

      {/* Details boxes for proposal metadata */}
      <section
        className="grid grid-cols-1 md:grid-cols-3 gap-3 bg-teal-bg p-2 rounded-3xl"
        aria-label="Proposal metadata"
      >
        <InfoBox label="Created">
          <span className="text-md text-neutral-300 font-semibold">
            <RelativeTime date={proposal.createdAt} />
          </span>
        </InfoBox>

        <InfoBox label="Author">
          <AuthorChip
            author={proposal.author}
            className="text-md text-neutral-300 font-semibold ml-2"
            iconDiameter={16}
          />
        </InfoBox>

        <InfoBox label="Deadline">
          <span className="text-md text-neutral-300 font-semibold">
            {formatDate(proposal.deadline)}
          </span>
        </InfoBox>
      </section>

      {/* Proposal Details */}
      {proposal.details && (
        <section
          className="bg-teal-bg rounded-3xl p-8 whitespace-pre-line text-neutral-300"
          aria-label="Additional proposal details"
        >
          <h2 className="sr-only">Additional Details</h2>
          {proposal.details}
        </section>
      )}
    </article>
  );
}
