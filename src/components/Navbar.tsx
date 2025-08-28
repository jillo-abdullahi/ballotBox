import { Link, useRouterState } from "@tanstack/react-router";
import { shareUrl } from "../utils";

export default function Navbar() {
  const router = useRouterState();
  const currentPath = router.location.pathname;

  // Extract proposal info if we're on a proposal page
  const isProposalPage = currentPath.startsWith("/proposal/");
  const proposalId = isProposalPage ? currentPath.split("/")[2] : null;

  // Check if we're on the create page
  const isCreatePage = currentPath === "/create";

  const handleShare = () => {
    if (proposalId) {
      const url = `${window.location.origin}/proposal/${proposalId}`;
      shareUrl(url, `Vote on proposal #${proposalId}`);
    }
  };

  return (
    <header className="sticky top-0 z-10 border-b border-neutral-800 bg-neutral-950/70 backdrop-blur">
      <div className="mx-auto max-w-6xl h-16 px-4 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2">
          <div className="h-8 w-8 rounded-xl bg-neutral-900 border border-neutral-800 grid place-items-center font-bold">
            Bb
          </div>
          <span className="text-sm text-neutral-400 hidden sm:inline">
            BallotBox
          </span>
        </Link>

        <nav className="flex items-center gap-2">
          {/* Back button for proposal pages */}
          {isProposalPage && (
            <Link
              to="/"
              className="rounded-lg border border-neutral-800 bg-neutral-900 px-3 py-2 text-sm hover:bg-neutral-800"
            >
              ← Back
            </Link>
          )}

          {/* Share button for proposal pages */}
          {isProposalPage && (
            <button
              onClick={handleShare}
              className="rounded-lg border border-neutral-800 bg-neutral-900 px-3 py-2 text-sm hover:bg-neutral-800"
              title="Share proposal"
            >
              Share
            </button>
          )}

          {/* Cancel/Back to Home button for create page */}
          {isCreatePage && (
            <Link
              to="/"
              className="rounded-lg border border-neutral-600 text-neutral-300 px-3 py-2 text-sm hover:bg-neutral-800 transition-colors"
            >
              ← Cancel
            </Link>
          )}

          {/* Mock wallet connection */}
          <button
            className="rounded-lg border border-neutral-800 bg-neutral-900 px-3 py-2 text-sm hover:bg-neutral-800"
            title="Connected wallet (mock)"
          >
            0x…a1b
          </button>
        </nav>
      </div>
    </header>
  );
}
