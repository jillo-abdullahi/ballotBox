import { useEffect, useState } from "react"
import { useParams } from "@tanstack/react-router"
import { useReadContract } from 'wagmi'
import { BALLOTBOX_ADDRESS, BALLOTBOX_ABI } from '../config/contract'
import { isProposalOpen } from '../utils'
import { fetchFromIPFS, isIPFSHashSync } from '../utils/ipfs'
import Navbar from '../components/Navbar'
import ProposalContent from '../components/ProposalContent'
import VotingCard from '../components/VotingCard'
import VotingStats from '../components/VotingStats'
import type { Proposal } from '../types'

export default function ProposalPage() {
  const { id } = useParams({ from: "/proposal/$id" })
  const pid = Number(id)
  const [proposal, setProposal] = useState<Proposal | null>(null)
  const [localVotes, setLocalVotes] = useState<{ yes: number; no: number } | null>(null)

  // Fetch proposal data from contract
  const { data: contractProposal } = useReadContract({
    address: BALLOTBOX_ADDRESS,
    abi: BALLOTBOX_ABI,
    functionName: 'proposals',
    args: [BigInt(pid)],
    query: {
      enabled: !!pid && pid > 0,
    }
  })

  // Process contract data and fetch IPFS content
  useEffect(() => {
    async function processProposal() {
      if (!contractProposal) {
        setProposal(null)
        return
      }

      const contract = contractProposal as readonly [bigint, `0x${string}`, bigint, bigint, number, number, boolean, string, string, `0x${string}`]
      
      // Check if proposal exists (id > 0)
      if (Number(contract[0]) === 0) {
        setProposal(null)
        return
      }

      try {
        let details = ""
        
        // If detailsHash is an IPFS hash, fetch the content
        if (isIPFSHashSync(contract[9])) {
          try {
            const ipfsContent = await fetchFromIPFS(contract[9])
            details = ipfsContent || ""
          } catch (error) {
            console.error('Failed to fetch IPFS content:', error)
          }
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
          no: Number(contract[3])
        }
        
        setProposal(processedProposal)
        setLocalVotes({ yes: processedProposal.yes, no: processedProposal.no })
      } catch (error) {
        console.error('Error processing proposal:', error)
        setProposal(null)
      }
    }

    processProposal()
  }, [contractProposal])

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