import { useMemo, useState } from "react"
import { MOCK_PROPOSALS } from '../data/mockProposals'
import Navbar from '../components/Navbar'
import InfoSection from '../components/InfoSection'
import ProposalsList from '../components/ProposalsList'

export default function HomePage() {
  // pagination state
  const [page, setPage] = useState(1)
  const perPage = 6 // Increased from 4 to show more content

  // sort (recent first)
  const sorted = useMemo(() => {
    return [...MOCK_PROPOSALS].sort((a, b) => b.createdAt - a.createdAt)
  }, [])

  // paginate
  const pageCount = Math.max(1, Math.ceil(sorted.length / perPage))
  const current = sorted.slice((page - 1) * perPage, page * perPage)

  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-100 w-full">
      <Navbar />
      
      {/* Content with improved layout */}
      <main className="mx-auto max-w-6xl px-4 py-8 space-y-8">
        <InfoSection />
        
        <ProposalsList
          proposals={current}
          totalCount={sorted.length}
          currentPage={page}
          totalPages={pageCount}
          onPageChange={setPage}
        />
      </main>
    </div>
  )
}
