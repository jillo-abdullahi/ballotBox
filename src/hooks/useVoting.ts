import { useWriteContract, useWaitForTransactionReceipt, useReadContract, useAccount } from 'wagmi';
import { BALLOTBOX_ADDRESS, BALLOTBOX_ABI } from '../config/contract';

export function useVoting(proposalId: number) {
  const { address } = useAccount();
  
  const {
    data: hash,
    error,
    isPending,
    writeContract
  } = useWriteContract();

  const {
    isLoading: isConfirming,
    isSuccess: isConfirmed,
    error: confirmError
  } = useWaitForTransactionReceipt({
    hash,
  });

  // Check if user has voted
  const { data: hasVoted, refetch: refetchHasVoted } = useReadContract({
    address: BALLOTBOX_ADDRESS,
    abi: BALLOTBOX_ABI,
    functionName: 'hasVoted',
    args: [BigInt(proposalId), address!],
    query: {
      enabled: !!address && proposalId > 0,
    }
  });

  // Get user's vote if they have voted
  const { data: userVote, refetch: refetchUserVote } = useReadContract({
    address: BALLOTBOX_ADDRESS,
    abi: BALLOTBOX_ABI,
    functionName: 'getVote',
    args: [BigInt(proposalId), address!],
    query: {
      enabled: !!address && proposalId > 0 && hasVoted,
    }
  });

  const vote = async (voteValue: boolean) => {
    if (!address) {
      throw new Error('Please connect your wallet to vote');
    }

    return writeContract({
      address: BALLOTBOX_ADDRESS,
      abi: BALLOTBOX_ABI,
      functionName: 'vote',
      args: [BigInt(proposalId), voteValue]
    });
  };

  const refetchVoteStatus = () => {
    refetchHasVoted();
    refetchUserVote();
  };

  return {
    vote,
    hash,
    isPending,
    isConfirming,
    isConfirmed,
    error: error || confirmError,
    hasVoted: Boolean(hasVoted),
    userVote: hasVoted ? Boolean(userVote) : null, // true = yes, false = no
    refetchVoteStatus,
    isConnected: !!address
  };
}
