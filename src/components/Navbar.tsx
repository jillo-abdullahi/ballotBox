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
      <div className="mx-auto max-w-6xl h-20 px-4 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2">
          <div className="h-10 w-10 rounded-xl bg-blue-bg border border-blue-text/20 grid place-items-center font-bold text-blue-text">
            Bb
          </div>
          <span className="text-base text-blue-text/80 hidden sm:inline font-medium">
            BallotBox
          </span>
        </Link>

        <nav className="flex items-center gap-3">
          {/* Back button for proposal pages */}
          {isProposalPage && (
            <Link
              to="/"
              className="rounded-xl bg-blue-bg/50 px-5 py-3 text-sm text-blue-text hover:bg-blue-bg/70 focus:bg-blue-bg/20 focus:ring-2 focus:ring-blue-text/20 focus:outline-none transition-all duration-200 font-medium"
            >
              ← Back
            </Link>
          )}

          {/* Share button for proposal pages */}
          {isProposalPage && (
            <button
              onClick={handleShare}
              className="rounded-xl bg-blue-bg/50 px-5 py-3 text-sm text-blue-text hover:bg-blue-bg/70 focus:bg-blue-bg/20 focus:ring-2 focus:ring-blue-text/20 focus:outline-none transition-all duration-200 font-medium"
              title="Share proposal"
            >
              Share
            </button>
          )}

          {/* Cancel/Back to Home button for create page */}
          {isCreatePage && (
            <Link
              to="/"
              className="rounded-xl bg-blue-bg/50 px-5 py-3 text-sm text-blue-text hover:bg-blue-bg/70 focus:bg-blue-bg/20 focus:ring-2 focus:ring-blue-text/20 focus:outline-none transition-all duration-200 font-medium"
            >
              ← Cancel
            </Link>
          )}

          {/* Mock wallet connection */}
          <button
            className="rounded-xl bg-blue-text/10 border border-blue-text/20 px-5 py-3 text-sm text-blue-text hover:bg-blue-text/20 focus:bg-blue-text/5 focus:ring-2 focus:ring-blue-text/20 focus:outline-none transition-all duration-200 font-medium"
            title="Connected wallet (mock)"
          >
            0x…a1b
          </button>
        </nav>
      </div>
    </header>
  );
}
