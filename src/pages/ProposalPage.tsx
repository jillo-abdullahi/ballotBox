import { useEffect, useMemo, useState } from "react"
import { useParams } from "@tanstack/react-router"
import { MOCK_PROPOSALS } from '../data/mockProposals'
import { isProposalOpen } from '../utils'
import Navbar from '../components/Navbar'
import ProposalContent from '../components/ProposalContent'
import VotingCard from '../components/VotingCard'
import VotingStats from '../components/VotingStats'

export default function ProposalPage() {
  const { id } = useParams({ from: "/proposal/$id" })
  const pid = Number(id)
  const proposal = useMemo(() => MOCK_PROPOSALS.find(m => m.id === pid) || null, [pid])
  const [localVotes, setLocalVotes] = useState<{ yes: number; no: number } | null>(null)

  useEffect(() => {
    if (!proposal) return
    setLocalVotes({ yes: proposal.yes, no: proposal.no })
  }, [proposal])

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
    )
  }

  const open = isProposalOpen(proposal.deadline)
  const yes = localVotes?.yes ?? proposal.yes
  const no = localVotes?.no ?? proposal.no

  function vote(kind: "yes" | "no") {
    if (!proposal) return
    // mock optimistic UI
    setLocalVotes(v => {
      const base = v ?? { yes: proposal.yes, no: proposal.no }
      return { 
        yes: base.yes + (kind === "yes" ? 1 : 0), 
        no: base.no + (kind === "no" ? 1 : 0) 
      }
    })
  }

  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-100">
      <Navbar />

      <main className="mx-auto max-w-6xl px-4 py-8">
        <div className="grid gap-6 md:grid-cols-[1fr,320px]">
          {/* Left: proposal content */}
          <ProposalContent proposal={proposal} />

          {/* Right: actions + stats */}
          <aside className="space-y-6">
            <VotingCard
              proposalTitle={proposal.title}
              proposalId={proposal.id}
              isOpen={open}
              onVote={vote}
            />
            
            <VotingStats yesVotes={yes} noVotes={no} />
          </aside>
        </div>
      </main>
    </div>
  )
}