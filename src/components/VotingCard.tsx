interface VotingCardProps {
  isOpen: boolean;
  onVote: (vote: "yes" | "no") => void;
  hasVoted?: boolean;
  userVote?: boolean | null; // true = yes, false = no, null = not voted
  isConnected?: boolean;
}

export default function VotingCard({ 
  isOpen, 
  onVote, 
  hasVoted = false, 
  userVote = null, 
  isConnected = true 
}: VotingCardProps) {
  const getButtonText = (vote: "yes" | "no") => {
    if (hasVoted && userVote !== null) {
      if ((vote === "yes" && userVote) || (vote === "no" && !userVote)) {
        return vote === "yes" ? "✓ Yes!" : "✓ No!";
      }
    }
    return vote === "yes" ? "Yes!" : "No!";
  };

  const getButtonClass = (vote: "yes" | "no") => {
    const baseClass = "rounded-xl text-lg border-none px-4 py-6 font-semibold transition-colors";
    const disabledClass = "disabled:cursor-not-allowed disabled:opacity-50";
    
    if (hasVoted && userVote !== null) {
      if ((vote === "yes" && userVote) || (vote === "no" && !userVote)) {
        // User voted for this option
        return `${baseClass} ${disabledClass} ${vote === "yes" ? "bg-green-600 text-white" : "bg-red-600 text-white"}`;
      } else {
        // User voted for the other option
        return `${baseClass} ${disabledClass} bg-neutral-700 text-neutral-400`;
      }
    }
    
    // Default styling
    if (vote === "yes") {
      return `${baseClass} ${disabledClass} bg-teal-text/50 text-neutral-200 hover:bg-teal-text/60 cursor-pointer`;
    } else {
      return `${baseClass} ${disabledClass} bg-teal-text/10 text-teal-text/80 hover:bg-teal-text/20 cursor-pointer`;
    }
  };

  const isDisabled = !isOpen || hasVoted || !isConnected;

  return (
    <div className="rounded-3xl border-none bg-neutral-950/40 p-8 bg-teal-bg">
      <div className="flex items-center justify-between">
        <h3 className="font-semibold text-teal-text text-2xl tracking-wide">
          Do you like this proposal?
        </h3>
      </div>

      {!isConnected && (
        <div className="mt-4 p-4 bg-yellow-900/20 border border-yellow-600/30 rounded-xl">
          <p className="text-yellow-400 text-sm">
            Please connect your wallet to vote
          </p>
        </div>
      )}

      {hasVoted && (
        <div className="mt-4 p-4 bg-blue-900/20 border border-blue-600/30 rounded-xl">
          <p className="text-blue-400 text-sm">
            You voted: {userVote ? "Yes" : "No"}
          </p>
        </div>
      )}

      <div className="mt-4 grid grid-cols-2 gap-2">
        <button
          onClick={() => onVote("yes")}
          disabled={isDisabled}
          className={getButtonClass("yes")}
        >
          {getButtonText("yes")}
        </button>
        <button
          onClick={() => onVote("no")}
          disabled={isDisabled}
          className={getButtonClass("no")}
        >
          {getButtonText("no")}
        </button>
      </div>

      <p className="mt-3 text-xs text-neutral-400">
        {!isConnected 
          ? "Connect your wallet to vote" 
          : hasVoted 
            ? "You have already voted on this proposal" 
            : `Voting is ${isOpen ? "open until the deadline." : "closed."}`
        }
      </p>
    </div>
  );
}
