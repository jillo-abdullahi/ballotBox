import { useNavigate } from "@tanstack/react-router";
import { FaSearch } from "react-icons/fa";
import { MdOutlineError } from "react-icons/md";

export default function NotFoundPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-100">
      <main className="mx-auto max-w-6xl px-4 py-8">
        {/* Header section with consistent styling */}
        <div className="mb-8 bg-blue-bg px-8 py-6 rounded-3xl">
          <h1 className="text-3xl md:text-4xl font-bold mb-2 text-blue-text">
            Page Not Found
          </h1>
          <p className="text-blue-text text-lg">
            The page you're looking for doesn't exist
          </p>
        </div>

        {/* 404 Content */}
        <div className="max-w-2xl mx-auto text-center">
          <div className="rounded-3xl border border-neutral-800 bg-neutral-950/40 p-12">
            {/* Error Icon */}
            <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-red-500/10 flex items-center justify-center">
              <MdOutlineError className="w-10 h-10 text-red-400" />
            </div>

            {/* Error Message */}
            <h2 className="text-2xl font-bold mb-4 text-neutral-100">
              Oops! Page Not Found
            </h2>
            <p className="text-neutral-400 mb-8 leading-relaxed">
              The page you're looking for might have been moved, deleted, or you
              might have entered an incorrect URL. Don't worry, it happens to
              the best of us!
            </p>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={() => navigate({ to: "/" })}
                className="cursor-pointer flex items-center justify-center gap-2 px-6 py-3 bg-blue-text text-gray-900 rounded-xl hover:bg-blue-text/90 transition-colors font-medium cursor-pointer"
              >
                <FaSearch className="w-4 h-4" />
                Browse Proposals
              </button>
            </div>

            {/* Additional Help */}
            <div className="mt-8 pt-6 border-t border-neutral-700/50">
              <p className="text-sm text-neutral-500 mb-4">
                Common pages you might be looking for:
              </p>
              <div className="flex flex-wrap justify-center gap-2">
                <button
                  onClick={() => navigate({ to: "/" })}
                  className="cursor-pointer text-blue-text hover:text-blue-text/80 transition-colors text-sm underline"
                >
                  All Proposals
                </button>
                <span className="text-neutral-600">•</span>
                <button
                  onClick={() => navigate({ to: "/create" })}
                  className="cursor-pointer text-blue-text hover:text-blue-text/80 transition-colors text-sm underline"
                >
                  Create Proposal
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
