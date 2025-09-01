import { useState, useEffect } from "react"
import { useReadContract } from 'wagmi'
import { BALLOTBOX_ADDRESS, BALLOTBOX_ABI } from '../config/contract'
import Navbar from '../components/Navbar'
import InfoSection from '../components/InfoSection'
import ProposalsList from '../components/ProposalsList'
import { fetchFromIPFS, isIPFSHashSync } from '../utils/ipfs'

interface ContractProposal {
  id: bigint
  author: `0x${string}`
  yesVotes: bigint
  noVotes: bigint
  createdAt: number
  deadline: number
  active: boolean
  title: string
  description: string
  detailsHash: `0x${string}`
}

interface DisplayProposal {
  id: number
  title: string
  description: string
  details?: string
  author: string
  createdAt: number
  deadline: number
  yes: number
  no: number
}

export default function HomePage() {
  // pagination state
  const [page, setPage] = useState(1)
  const perPage = 6
  const [proposals, setProposals] = useState<DisplayProposal[]>([])

  // Fetch total count to know how many proposals exist
  const { data: totalCount } = useReadContract({
    address: BALLOTBOX_ADDRESS,
    abi: BALLOTBOX_ABI,
    functionName: 'proposalCount',
  })

  // Calculate pagination for contract calls
  const startIndex = Math.max(0, Number(totalCount || 0) - (page * perPage))
  const endIndex = Math.max(0, Number(totalCount || 0) - ((page - 1) * perPage))

  // Fetch proposals for current page
  const { data: contractProposals } = useReadContract({
    address: BALLOTBOX_ADDRESS,
    abi: BALLOTBOX_ABI,
    functionName: 'getProposals',
    args: [BigInt(startIndex), BigInt(Math.min(perPage, endIndex - startIndex))],
    query: {
      enabled: !!totalCount && Number(totalCount) > 0,
    }
  })

  // Process contract data and fetch IPFS content
  useEffect(() => {
    async function processProposals() {
      if (!contractProposals) {
        return
      }

      try {
        const processed = await Promise.all(
          (contractProposals as readonly ContractProposal[]).map(async (proposal) => {
            let details = ""
            
            // If detailsHash is an IPFS hash, fetch the content
            if (isIPFSHashSync(proposal.detailsHash)) {
              try {
                const ipfsContent = await fetchFromIPFS(proposal.detailsHash)
                details = ipfsContent || ""
              } catch (error) {
                console.error('Failed to fetch IPFS content:', error)
                // Keep empty as fallback
              }
            }

            return {
              id: Number(proposal.id),
              title: proposal.title,
              description: proposal.description,
              details,
              author: proposal.author,
              createdAt: proposal.createdAt,
              deadline: proposal.deadline,
              yes: Number(proposal.yesVotes),
              no: Number(proposal.noVotes)
            }
          })
        )
        
        // Sort by creation time (newest first)
        processed.sort((a, b) => b.createdAt - a.createdAt)
        setProposals(processed)
      } catch (error) {
        console.error('Error processing proposals:', error)
        setProposals([])
      }
    }

    processProposals()
  }, [contractProposals])

  const pageCount = Math.max(1, Math.ceil(Number(totalCount || 0) / perPage))

  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-100 w-full">
      <Navbar />
      
      {/* Content with improved layout */}
      <main className="mx-auto max-w-6xl px-4 py-8 space-y-8">
        <InfoSection />
        
        <ProposalsList
          proposals={proposals}
          totalCount={Number(totalCount || 0)}
          currentPage={page}
          totalPages={pageCount}
          onPageChange={setPage}
        />
      </main>
    </div>
  )
}
