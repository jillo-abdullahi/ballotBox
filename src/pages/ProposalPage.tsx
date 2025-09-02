import { useEffect, useState } from "react";
import { useParams } from "@tanstack/react-router";
import { useReadContract, useAccount } from "wagmi";
import { BALLOTBOX_ADDRESS, BALLOTBOX_ABI } from "../config/contract";
import { isProposalOpen } from "../utils";
import { fetchFromIPFS, getIPFSHashFromBytes32 } from "../utils/ipfs";
import { useVoting } from "../hooks/useVoting";
import Navbar from "../components/Navbar";
import ProposalContent from "../components/ProposalContent";
import VotingCard from "../components/VotingCard";
import VotingStats from "../components/VotingStats";
import VoteModal from "../components/VoteModal";
import ProposalSkeleton from "../components/ProposalSkeleton";
import type { Proposal } from "../types";

export default function ProposalPage() {
  const { id } = useParams({ from: "/proposal/$id" });
  const pid = Number(id);
  const { address } = useAccount();
  const [proposal, setProposal] = useState<Proposal | null>(null);
  const [localVotes, setLocalVotes] = useState<{
    yes: number;
    no: number;
  } | null>(null);
  const [showVoteModal, setShowVoteModal] = useState(false);
  const [pendingVote, setPendingVote] = useState<boolean | null>(null); // true = yes, false = no
  const [isLoading, setIsLoading] = useState(true);
  const [proposalNotFound, setProposalNotFound] = useState(false);

  // Only need voting hook for checking vote status, not for submitting votes
  const { hasVoted, userVote, refetchVoteStatus, isConnected } = useVoting(pid);

  // Fetch proposal data from contract
  const {
    data: contractProposal,
    isLoading: isContractLoading,
    refetch: refetchProposal,
  } = useReadContract({
    address: BALLOTBOX_ADDRESS,
    abi: BALLOTBOX_ABI,
    functionName: "proposals",
    args: [BigInt(pid)],
    query: {
      enabled: !!pid && pid > 0,
    },
  });

  // Process contract data and fetch IPFS content
  useEffect(() => {
    async function processProposal() {
      if (!contractProposal) {
        // Only set as not found if we have explicitly received data but no proposal
        if (contractProposal === null) {
          setProposalNotFound(true);
          setIsLoading(false);
        }
        return;
      }

      setIsLoading(true);
      setProposalNotFound(false);

      const contract = contractProposal as readonly [
        bigint,
        `0x${string}`,
        bigint,
        bigint,
        number,
        number,
        boolean,
        string,
        string,
        `0x${string}`
      ];

      // Check if proposal exists (id > 0)
      if (Number(contract[0]) === 0) {
        setProposal(null);
        setProposalNotFound(true);
        setIsLoading(false);
        return;
      }

      try {
        let details = "";

        // Try to get the original IPFS hash from the bytes32 detailsHash
        const originalIPFSHash = getIPFSHashFromBytes32(contract[9]);

        if (originalIPFSHash) {
          try {
            const ipfsContent = await fetchFromIPFS(originalIPFSHash);
            details = ipfsContent || "";
          } catch (error) {
            console.error("Failed to fetch IPFS content:", error);
          }
        } else {
          console.error("No valid IPFS hash found in detailsHash:", contract[9]);
        }

        const processedProposal: Proposal = {
          id: Number(contract[0]),
          title: contract[7],
          description: contract[8],
          details,
          author: contract[1],
          createdAt: contract[4],
          deadline: contract[5],
          yes: Number(contract[2]),
          no: Number(contract[3]),
        };

        setProposal(processedProposal);
        setLocalVotes({ yes: processedProposal.yes, no: processedProposal.no });
        setIsLoading(false);
      } catch (error) {
        console.error("Error processing proposal:", error);
        setProposal(null);
        setProposalNotFound(true);
        setIsLoading(false);
      }
    }

    processProposal();
  }, [contractProposal]);

  // Reset modal state when wallet account changes
  useEffect(() => {
    setShowVoteModal(false);
    setPendingVote(null);
  }, [address]); // Reset when address changes

  // Show loading skeleton while fetching data
  if (isLoading || isContractLoading) {
    return (
      <>
        <Navbar />
        <ProposalSkeleton />
      </>
    );
  }

  // Show not found message only after we've determined the proposal doesn't exist
  if (proposalNotFound || !proposal) {
    return (
      <div className="min-h-screen bg-neutral-950 text-neutral-100">
        <Navbar />
        <main className="mx-auto max-w-6xl px-4 py-8">
          <div className="rounded-2xl border border-neutral-800 bg-neutral-950/40 p-6">
            <p className="text-red-300">Proposal not found.</p>
          </div>
        </main>
      </div>
    );
  }

  const open = isProposalOpen(proposal.deadline);
  const yes = localVotes?.yes ?? proposal.yes;
  const no = localVotes?.no ?? proposal.no;

  function vote(kind: "yes" | "no") {
    if (!proposal) return;

    // Set the pending vote and show modal
    setPendingVote(kind === "yes");
    setShowVoteModal(true);
  }

  const handleVoteSuccess = () => {
    // Refresh data when vote is successful
    setLocalVotes(null);
    refetchProposal();
    refetchVoteStatus();
  };

  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-100">
      <Navbar />

      <main className="mx-auto max-w-6xl px-4 py-8">
        <div className="grid gap-6 md:grid-cols-[1fr,320px]">
          {/* Top: proposal content */}
          <ProposalContent proposal={proposal} />

          {/* Bottom: actions + stats */}
          <aside className="space-y-2">
            <VotingCard
              isOpen={open}
              onVote={vote}
              hasVoted={hasVoted}
              userVote={userVote}
              isConnected={isConnected}
            />

            <VotingStats yesVotes={yes} noVotes={no} />
          </aside>
        </div>

        {/* Vote Modal */}
        {showVoteModal && pendingVote !== null && (
          <VoteModal
            isOpen={showVoteModal}
            onClose={() => setShowVoteModal(false)}
            proposalId={pid}
            voteValue={pendingVote}
            onSuccess={handleVoteSuccess}
          />
        )}
      </main>
    </div>
  );
}
