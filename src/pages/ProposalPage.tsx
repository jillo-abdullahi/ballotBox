import { useEffect, useState } from "react";
import { useParams } from "@tanstack/react-router";
import { useReadContract } from "wagmi";
import { BALLOTBOX_ADDRESS, BALLOTBOX_ABI } from "../config/contract";
import { isProposalOpen } from "../utils";
import { fetchFromIPFS, getIPFSHashFromBytes32 } from "../utils/ipfs";
import { useVoting } from "../hooks/useVoting";
import Navbar from "../components/Navbar";
import ProposalContent from "../components/ProposalContent";
import VotingCard from "../components/VotingCard";
import VotingStats from "../components/VotingStats";
import ContractTransactionModal from "../components/ContractTransactionModal";
import type { Proposal } from "../types";

export default function ProposalPage() {
  const { id } = useParams({ from: "/proposal/$id" });
  const pid = Number(id);
  const [proposal, setProposal] = useState<Proposal | null>(null);
  const [localVotes, setLocalVotes] = useState<{
    yes: number;
    no: number;
  } | null>(null);
  const [showVoteModal, setShowVoteModal] = useState(false);
  const [pendingVote, setPendingVote] = useState<boolean | null>(null); // true = yes, false = no

  // Voting hook
  const {
    vote: submitVote,
    isPending: isVotePending,
    isConfirming: isVoteConfirming,
    isConfirmed: isVoteConfirmed,
    hasVoted,
    userVote,
    error: voteError,
    refetchVoteStatus,
    isConnected,
  } = useVoting(pid);

  // Fetch proposal data from contract
  const { data: contractProposal, refetch: refetchProposal } = useReadContract({
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
        setProposal(null);
        return;
      }

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
        return;
      }

      try {
        let details = "";

        // Try to get the original IPFS hash from the bytes32 detailsHash
        const originalIPFSHash = getIPFSHashFromBytes32(contract[9]);

        if (originalIPFSHash) {
          try {
            console.log("Fetching IPFS content for hash:", originalIPFSHash);
            const ipfsContent = await fetchFromIPFS(originalIPFSHash);
            details = ipfsContent || "";
            console.log(
              "Successfully fetched IPFS content:",
              details ? "Content found" : "No content"
            );
          } catch (error) {
            console.error("Failed to fetch IPFS content:", error);
          }
        } else {
          console.log("No valid IPFS hash found in detailsHash:", contract[9]);
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
      } catch (error) {
        console.error("Error processing proposal:", error);
        setProposal(null);
      }
    }

    processProposal();
  }, [contractProposal]);

  // Handle vote confirmation - refetch data when vote is confirmed
  useEffect(() => {
    if (isVoteConfirmed) {
      refetchProposal();
      refetchVoteStatus();
    }
  }, [isVoteConfirmed, refetchProposal, refetchVoteStatus]);

  if (!proposal) {
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

  const handleVoteConfirm = async () => {
    if (pendingVote === null) return;

    try {
      await submitVote(pendingVote);
      // Optimistic UI update
      if (proposal) {
        setLocalVotes((v) => {
          const base = v ?? { yes: proposal.yes, no: proposal.no };
          return {
            yes: base.yes + (pendingVote ? 1 : 0),
            no: base.no + (!pendingVote ? 1 : 0),
          };
        });
      }
    } catch (error) {
      console.error("Vote failed:", error);
      throw error; // Re-throw to let modal handle the error state
    }
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

        {/* Vote Transaction Modal */}
        <ContractTransactionModal
          isOpen={showVoteModal}
          onClose={() => setShowVoteModal(false)}
          onConfirm={handleVoteConfirm}
          title={pendingVote ? "Vote Yes" : "Vote No"}
          description={`You're about to vote "${
            pendingVote ? "Yes" : "No"
          }" on this proposal. This will require a transaction to be confirmed in your wallet.`}
          successTitle="Vote Submitted!"
          successDescription={`Your "${
            pendingVote ? "Yes" : "No"
          }" vote has been successfully recorded on the blockchain.`}
          isPending={isVotePending}
          isConfirming={isVoteConfirming}
          isConfirmed={isVoteConfirmed}
          error={voteError}
        />
      </main>
    </div>
  );
}
