import { calculateVotingPercentages } from '../utils'

interface VotingStatsProps {
  yesVotes: number
  noVotes: number
}

export default function VotingStats({ yesVotes, noVotes }: VotingStatsProps) {
  const { yesPct, noPct, total } = calculateVotingPercentages(yesVotes, noVotes)

  return (
    <div className="rounded-2xl border border-neutral-800 bg-neutral-950/40 p-5">
      <h3 className="font-medium">Impressions</h3>
      <div className="mt-3 space-y-3">
        <div>
          <div className="flex justify-between text-xs text-neutral-400">
            <span>Yes</span>
            <span>{yesVotes} ({yesPct}%)</span>
          </div>
          <div className="mt-1 h-2 w-full rounded-full bg-neutral-900 border border-neutral-800 overflow-hidden">
            <div 
              className="h-full bg-emerald-500 transition-[width] duration-500" 
              style={{ width: `${yesPct}%` }} 
            />
          </div>
        </div>

        <div>
          <div className="flex justify-between text-xs text-neutral-400">
            <span>No</span>
            <span>{noVotes} ({noPct}%)</span>
          </div>
          <div className="mt-1 h-2 w-full rounded-full bg-neutral-900 border border-neutral-800 overflow-hidden">
            <div 
              className="h-full bg-red-500 transition-[width] duration-500" 
              style={{ width: `${noPct}%` }} 
            />
          </div>
        </div>

        <div className="pt-2 border-t border-neutral-800 text-xs text-neutral-400">
          Total votes: {total}
        </div>
      </div>
    </div>
  )
}
