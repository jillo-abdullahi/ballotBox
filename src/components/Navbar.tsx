import { Link, useRouterState } from "@tanstack/react-router";
import { shareUrl } from "../utils";
import CustomConnectButton from "./CustomConnectButton";
import { TbHeartShare } from "react-icons/tb";
import { IoArrowBack } from "react-icons/io5";



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

        <nav className="flex items-center gap-2 sm:gap-3">
          {/* Back button for proposal pages */}
          {isProposalPage && (
            <Link
              to="/"
              className="flex items-center cursor-pointer rounded-xl bg-blue-bg/50 px-3 py-2 sm:px-5 sm:py-3 text-sm text-blue-text hover:bg-blue-bg/70 focus:bg-blue-bg/20 focus:ring-2 focus:ring-blue-text/20 focus:outline-none transition-all duration-200 font-medium"
            >
              <IoArrowBack size={16} className="inline sm:mr-2" />
              <span className="hidden sm:inline">Back</span>
            </Link>
          )}

          {/* Share button for proposal pages */}
          {isProposalPage && (
            <button
              onClick={handleShare}
              className="flex items-center cursor-pointer rounded-xl bg-blue-bg/50 px-3 py-2 sm:px-5 sm:py-3 text-sm text-blue-text hover:bg-blue-bg/70 focus:bg-blue-bg/20 focus:ring-2 focus:ring-blue-text/20 focus:outline-none transition-all duration-200 font-medium"
              title="Share proposal"
            >
              <TbHeartShare size={16} className="inline sm:mr-2" />
              <span className="hidden sm:inline">Share</span>
            </button>
          )}

          {/* Cancel/Back to Home button for create page */}
          {isCreatePage && (
            <Link
              to="/"
              className="rounded-xl bg-blue-bg/50 px-3 py-2 sm:px-5 sm:py-3 text-sm text-blue-text hover:bg-blue-bg/70 focus:bg-blue-bg/20 focus:ring-2 focus:ring-blue-text/20 focus:outline-none transition-all duration-200 font-medium"
            >
              <span className="hidden sm:inline">← Cancel</span>
              <span className="sm:hidden">←</span>
            </Link>
          )}

          {/* RainbowKit wallet connection */}
          <CustomConnectButton />
        </nav>
      </div>
    </header>
  );
}
