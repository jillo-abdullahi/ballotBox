interface SearchSectionProps {
  query: string
  onQueryChange: (query: string) => void
}

export default function SearchSection({ query, onQueryChange }: SearchSectionProps) {
  return (
    <section className="rounded-2xl border border-neutral-800 bg-neutral-950/40">
      <div className="p-4 md:p-6">
        <label className="block text-sm text-neutral-400 mb-2">Search proposals</label>
        <div className="relative">
          <input
            className="w-full rounded-xl bg-neutral-900 border border-neutral-800 px-4 py-3 pr-11 outline-none focus:border-neutral-600"
            placeholder="Type keywords, author (0x…), or title…"
            value={query}
            onChange={(e) => onQueryChange(e.target.value)}
          />
          {/* search icon (inline svg) */}
          <svg
            className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-neutral-500"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
              d="M21 21l-4.3-4.3M10.5 18a7.5 7.5 0 100-15 7.5 7.5 0 000 15z" />
          </svg>
        </div>
      </div>
    </section>
  )
}
