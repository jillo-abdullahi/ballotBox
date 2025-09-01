import { calculateVotingPercentages } from '../utils'

interface VotingStatsProps {
  yesVotes: number
  noVotes: number
}

export default function VotingStats({ yesVotes, noVotes }: VotingStatsProps) {
  const { yesPct, noPct, total } = calculateVotingPercentages(yesVotes, noVotes)

  return (
    <div className="rounded-3xl border-none bg-neutral-950/40 p-8 bg-teal-bg">
      <h3 className="font-medium text-lg tracking-wide">Impressions</h3>
      <div className="mt-3 space-y-3">
          <div className="relative h-10 w-full rounded-xl bg-neutral-900 border-none overflow-hidden">
            <div 
              className="h-full bg-teal-text/50 transition-[width] duration-500" 
              style={{ width: `${yesPct}%` }} 
            />
            <div className="absolute inset-0 flex items-center justify-between px-3 text-sm font-medium">
              <span className="text-neutral-200 font-medium">Yes</span>
              <span className="text-neutral-200">{yesVotes} ({yesPct}%)</span>
            </div>
          </div>

          <div className="relative h-10 w-full rounded-xl bg-neutral-900 border-none overflow-hidden">
            <div 
              className="h-full bg-teal-text/10 transition-[width] duration-500" 
              style={{ width: `${noPct}%` }} 
            />
            <div className="absolute inset-0 flex items-center justify-between px-3 text-sm font-medium">
              <span className="text-teal-text/80 font-medium">No</span>
              <span className="text-neutral-200">{noVotes} ({noPct}%)</span>
            </div>
          </div>

        <div className="pt-4 text-xs text-neutral-400">
          Total votes: {total}
        </div>
      </div>
    </div>
  )
}
