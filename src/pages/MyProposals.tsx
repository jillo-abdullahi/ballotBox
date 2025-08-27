import { useMemo, useRef, useState, useEffect } from "react";
import { MOCK_PROPOSALS } from "../data/mockProposals";
import { Navbar, SearchSection, MyProposalCard, Pagination } from "../components";

export default function MyProposals() {
  const [q, setQ] = useState("");
  const [page, setPage] = useState(1);
  const perPage = 5;

  const CURRENT_USER = "0x92d3…a1b4"; // swap with wagmi's `address` later

  // debounce search
  const [dq, setDq] = useState(q);
  const t = useRef<number | undefined>(undefined);
  useEffect(() => {
    window.clearTimeout(t.current);
    t.current = window.setTimeout(() => setDq(q.trim()), 250);
    return () => window.clearTimeout(t.current);
  }, [q]);

  // filter by author + search, newest first
  const mine = useMemo(
    () => MOCK_PROPOSALS.filter((p) => p.author === CURRENT_USER),
    []
  );
  const filtered = useMemo(() => {
    const base = [...mine].sort((a, b) => b.createdAt - a.createdAt);
    if (!dq) return base;
    const s = dq.toLowerCase();
    return base.filter(
      (p) =>
        p.title.toLowerCase().includes(s) ||
        p.description.toLowerCase().includes(s) ||
        p.author.toLowerCase().includes(s)
    );
  }, [mine, dq]);

  const pageCount = Math.max(1, Math.ceil(filtered.length / perPage));
  const current = filtered.slice((page - 1) * perPage, page * perPage);
  useEffect(() => setPage(1), [dq]);

  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-100">
      <Navbar />

      <main className="mx-auto max-w-6xl px-4 py-8 space-y-8">
        <SearchSection
          query={q}
          onQueryChange={setQ}
          placeholder="Title, description…"
          label="Search my proposals"
          resultCount={filtered.length}
          showResultCount={true}
        />

        <section className="space-y-4">
          <h2 className="text-lg font-medium">My recent proposals</h2>
          
          {current.length === 0 && (
            <p className="text-sm text-neutral-400">No proposals yet.</p>
          )}

          <ul className="grid gap-4">
            {current.map((proposal) => (
              <MyProposalCard key={proposal.id} proposal={proposal} />
            ))}
          </ul>

          {pageCount > 1 && (
            <Pagination
              currentPage={page}
              totalPages={pageCount}
              onPageChange={setPage}
            />
          )}
        </section>
      </main>
    </div>
  );
}
