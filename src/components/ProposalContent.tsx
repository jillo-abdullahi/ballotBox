import { MdLightbulb } from "react-icons/md";

import type { Proposal } from "../types";
import { formatDate, isProposalOpen } from "../utils";
import RelativeTime from "./RelativeTime";
import InfoBox from "./InfoBox";

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

          {!open ? (
            <div className="rounded-full px-3 py-1 flex items-center justify-between bg-red-bg ml-2">
              <span className="text-sm text-red-text">Closed</span>
            </div>
          ) : null}
        </div>
        <h1 className="text-3xl md:text-4xl font-bold text-teal-text mb-4">
          {proposal.title}
        </h1>
        <p className="text-lg text-teal-text mb-2">{proposal.description}</p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mt-2 bg-teal-text/10 p-2 rounded-2xl mt-6">
          {/* Created at Pill */}
          <InfoBox label="Created">
            <span className="text-md text-teal-text font-semibold">
              <RelativeTime date={proposal.createdAt} />
            </span>
          </InfoBox>

          {/* Author Pill */}
          <InfoBox label="Author">
            <span className="text-md text-teal-text font-semibold">
              {proposal.author}
            </span>
          </InfoBox>

          {/* Deadline Pill */}
          <InfoBox label="Deadline">
            <span className="text-md text-teal-text font-semibold">
              {formatDate(proposal.deadline)}
            </span>
          </InfoBox>
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
