import { Link } from "@tanstack/react-router"

export default function Navbar() {
  return (
    <header className="sticky top-0 z-10 border-b border-neutral-800 bg-neutral-950/70 backdrop-blur">
      <div className="mx-auto max-w-6xl h-16 px-4 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2">
          <div className="h-8 w-8 rounded-xl bg-neutral-900 border border-neutral-800 grid place-items-center font-bold">
            Bb
          </div>
          <span className="text-sm text-neutral-400 hidden sm:inline">BallotBox</span>
        </Link>
        <nav className="flex items-center gap-2">
          <Link
            to="/my-proposals"
            className="rounded-lg border border-neutral-800 bg-neutral-900 px-3 py-2 text-sm hover:bg-neutral-800"
          >
            My proposals
          </Link>
          {/* mock address dropdown */}
          <button
            className="rounded-lg border border-neutral-800 bg-neutral-900 px-3 py-2 text-sm hover:bg-neutral-800"
            title="Connected wallet (mock)"
          >
            0x…a1b
          </button>
        </nav>
      </div>
    </header>
  )
}
