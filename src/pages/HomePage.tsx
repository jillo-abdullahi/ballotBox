import { useEffect, useMemo, useRef, useState } from "react"
import { MOCK_PROPOSALS } from '../data/mockProposals'
import Navbar from '../components/Navbar'
import SearchSection from '../components/SearchSection'
import ProposalsList from '../components/ProposalsList'

export default function HomePage() {
  // search + pagination state
  const [q, setQ] = useState("")
  const [page, setPage] = useState(1)
  const perPage = 6 // Increased from 4 to show more content

  // debounce search
  const [dq, setDq] = useState(q)
  const t = useRef<number | undefined>(undefined)
  useEffect(() => {
    window.clearTimeout(t.current)
    t.current = window.setTimeout(() => setDq(q.trim()), 250)
    return () => window.clearTimeout(t.current)
  }, [q])

  // filter + sort (recent first)
  const filtered = useMemo(() => {
    const src = [...MOCK_PROPOSALS].sort((a, b) => b.createdAt - a.createdAt)
    if (!dq) return src
    const s = dq.toLowerCase()
    return src.filter(
      (p) =>
        p.title.toLowerCase().includes(s) ||
        p.description.toLowerCase().includes(s) ||
        p.author.toLowerCase().includes(s)
    )
  }, [dq])

  // paginate after filter
  const pageCount = Math.max(1, Math.ceil(filtered.length / perPage))
  const current = filtered.slice((page - 1) * perPage, page * perPage)

  useEffect(() => setPage(1), [dq]) // reset page on new query

  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-100 w-full">
      <Navbar />
      
      {/* Content with improved layout */}
      <main className="mx-auto max-w-6xl px-4 py-8 space-y-8">
        <SearchSection query={q} onQueryChange={setQ} />
        
        <ProposalsList
          proposals={current}
          totalCount={filtered.length}
          currentPage={page}
          totalPages={pageCount}
          onPageChange={setPage}
        />
      </main>
    </div>
  )
}
