import { shareUrl } from '../utils'

interface VotingCardProps {
  proposalTitle: string
  proposalId: number
  isOpen: boolean
  onVote: (vote: 'yes' | 'no') => void
}

export default function VotingCard({ proposalTitle, proposalId, isOpen, onVote }: VotingCardProps) {
  const handleShare = () => {
    const url = `${window.location.origin}/proposal/${proposalId}`
    shareUrl(url, `Vote on: ${proposalTitle}`)
  }

  return (
    <div className="rounded-2xl border border-neutral-800 bg-neutral-950/40 p-5">
      <div className="flex items-center justify-between">
        <h3 className="font-medium">Do you like this proposal?</h3>
        <button
          onClick={handleShare}
          className="rounded-lg border border-neutral-800 bg-neutral-900 px-2.5 py-1.5 text-xs hover:bg-neutral-800"
        >
          Share
        </button>
      </div>

      <div className="mt-4 grid grid-cols-2 gap-2">
        <button
          onClick={() => onVote("yes")}
          disabled={!isOpen}
          className="rounded-xl border border-neutral-800 bg-neutral-900 px-4 py-3 hover:bg-neutral-800 disabled:opacity-50"
        >
          Yes
        </button>
        <button
          onClick={() => onVote("no")}
          disabled={!isOpen}
          className="rounded-xl border border-neutral-800 bg-neutral-900 px-4 py-3 hover:bg-neutral-800 disabled:opacity-50"
        >
          No
        </button>
      </div>

      <p className="mt-3 text-xs text-neutral-400">
        Voting is {isOpen ? "open until the deadline." : "closed."}
      </p>
    </div>
  )
}
