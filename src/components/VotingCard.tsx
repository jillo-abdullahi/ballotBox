interface VotingCardProps {
  isOpen: boolean;
  onVote: (vote: "yes" | "no") => void;
}

export default function VotingCard({ isOpen, onVote }: VotingCardProps) {
  return (
    <div className="rounded-3xl border-none bg-neutral-950/40 p-8 bg-teal-bg">
      <div className="flex items-center justify-between">
        <h3 className="font-semibold text-teal-text text-2xl tracking-wide">
          Do you like this proposal?
        </h3>
      </div>

      <div className="mt-4 grid grid-cols-2 gap-2">
        <button
          onClick={() => onVote("yes")}
          disabled={!isOpen}
          className="rounded-xl text-lg border-none bg-teal-text/90 px-4 py-6 hover:bg-teal-text disabled:opacity-90 disabled:text-gray-900 disabled:cursor-not-allowed cursor-pointer font-semibold"
        >
          Yes!
        </button>
        <button
          onClick={() => onVote("no")}
          disabled={!isOpen}
          className="text-lg rounded-xl border-none bg-red-text/70 text-gray-900 px-4 py-3 hover:bg-red-text/90 disabled:opacity-90 disabled:cursor-not-allowed cursor-pointer text-white font-semibold"
        >
          No!
        </button>
      </div>

      <p className="mt-3 text-xs text-neutral-400">
        Voting is {isOpen ? "open until the deadline." : "closed."}
      </p>
    </div>
  );
}
