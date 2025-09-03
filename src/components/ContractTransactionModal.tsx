import { useEffect, useState } from "react";
import { CiLock, CiCircleCheck } from "react-icons/ci";
import { MdErrorOutline } from "react-icons/md";

interface ContractTransactionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => Promise<void>;
  title: string;
  description: string;
  successTitle?: string;
  successDescription?: string;
  isPending: boolean;
  isConfirming: boolean;
  isConfirmed: boolean;
  error: Error | null;
  transactionHash?: string;
  proposalTitle?: string;
  onViewProposals?: () => void;
}

export default function ContractTransactionModal({
  isOpen,
  onClose,
  onConfirm,
  title,
  description,
  successTitle = "Transaction Successful!",
  successDescription = "Your transaction has been completed successfully and is now confirmed on the blockchain.",
  isPending,
  isConfirming,
  isConfirmed,
  error,
  transactionHash,
  proposalTitle,
  onViewProposals,
}: ContractTransactionModalProps) {
  const [hasStarted, setHasStarted] = useState(false);

  useEffect(() => {
    if (isOpen && !hasStarted) {
      setHasStarted(false);
    }
  }, [isOpen]);

  useEffect(() => {
    if (isPending || isConfirming) {
      setHasStarted(true);
    }
  }, [isPending, isConfirming]);

  const handleConfirm = async () => {
    try {
      await onConfirm();
    } catch (err) {
      // Error is handled by the hook
      console.error("Transaction failed:", err);
    }
  };

  const handleClose = () => {
    if (isPending || isConfirming) {
      return; // Don't allow closing during transaction
    }
    onClose();
    setHasStarted(false);
  };

  if (!isOpen) return null;

  // Determine current state
  let currentState: "idle" | "pending" | "confirming" | "success" | "error" =
    "idle";
  if (error) currentState = "error";
  else if (isConfirmed) currentState = "success";
  else if (isConfirming) currentState = "confirming";
  else if (isPending) currentState = "pending";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={handleClose}
      />

      {/* Modal */}
      <div className="relative bg-blue-bg border border-blue-text/20 rounded-3xl p-8 max-w-md mx-4 w-full">
        {/* Close button - only show when not in progress */}
        {currentState !== "pending" && currentState !== "confirming" && (
          <button
            onClick={handleClose}
            className="absolute top-4 right-4 text-neutral-400 hover:text-neutral-200 transition-colors cursor-pointer"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        )}

        <div className="text-center">
          {/* Icon based on state */}
          <div className="w-16 h-16 mx-auto rounded-full flex items-center justify-center">
            {currentState === "idle" && (
              <CiLock className="absolute w-8 h-8 text-blue-text" />
            )}

            {(currentState === "pending" || currentState === "confirming") && (
              <div className="bg-transparent">
                <div className="w-8 h-8 border-2 border-teal-text/30 border-t-teal-text rounded-full animate-spin" />
              </div>
            )}

            {currentState === "success" && (
              <CiCircleCheck className="w-8 h-8 text-green-500" />
            )}

            {currentState === "error" && (
              <MdErrorOutline className="absolute w-8 h-8 text-red-text" />
            )}
          </div>

          {/* Title and description based on state */}
          {currentState === "idle" && (
            <>
              <h3 className="text-xl font-bold text-blue-text mb-4">{title}</h3>
              <p className="text-neutral-300 mb-8 leading-relaxed">
                {description}
              </p>
            </>
          )}

          {currentState === "pending" && (
            <>
              <h3 className="text-xl font-bold text-teal-text mb-4">
                Confirm Transaction
              </h3>
              <p className="text-neutral-300 mb-8 leading-relaxed">
                Please confirm the transaction in your wallet to proceed.
              </p>
            </>
          )}

          {currentState === "confirming" && (
            <>
              <h3 className="text-xl font-bold text-teal-text mb-4">
                Processing Transaction
              </h3>
              <p className="text-neutral-300 mb-8 leading-relaxed">
                Your transaction is being processed on the blockchain. Please
                wait...
              </p>
            </>
          )}

          {currentState === "success" && (
            <>
              <h3 className="text-xl font-bold text-green-500 mb-4">
                {successTitle}
              </h3>

              {/* Proposal-specific success info */}
              {proposalTitle && (
                <div className="mb-6 p-4 bg-green-500/10 border border-green-500/20 rounded-xl">
                  <p className="text-green-400 font-medium mb-2">
                    Proposal Created Successfully!
                  </p>
                  <p className="text-neutral-300 text-md mb-1 text-center line-clamp-2">
                    {proposalTitle}
                  </p>
                </div>
              )}

              <p className="text-neutral-300 mb-6 leading-relaxed">
                {successDescription}
              </p>

              {/* Transaction hash link */}
              {transactionHash && (
                <div className="mb-6">
                  <a
                    href={`https://sepolia.etherscan.io/tx/${transactionHash}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 text-blue-text hover:text-blue-text/80 transition-colors text-sm"
                  >
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                      />
                    </svg>
                    View on Etherscan
                  </a>
                </div>
              )}
            </>
          )}

          {currentState === "error" && (
            <>
              <h3 className="text-xl font-bold text-red-text mb-4">
                Transaction Failed
              </h3>
              <p className="text-neutral-300 mb-8 leading-relaxed">
                Your transaction could not be completed. This might be due to
                network issues, insufficient funds, or the transaction was
                rejected.
              </p>
            </>
          )}

          {/* Action buttons */}
          <div className="flex gap-4 justify-center">
            {currentState === "idle" && (
              <>
                <button
                  onClick={handleClose}
                  className="px-6 py-3 bg-neutral-800 text-neutral-200 rounded-xl hover:bg-neutral-700 transition-colors font-medium cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  onClick={handleConfirm}
                  className="px-8 py-3 bg-blue-text text-gray-900 rounded-xl hover:bg-blue-text/90 transition-colors font-medium cursor-pointer"
                >
                  Confirm
                </button>
              </>
            )}

            {currentState === "success" && (
              <>
                {/* Proposal creation success actions */}
                {onViewProposals ? (
                  <>
                    <button
                      onClick={onViewProposals}
                      className="px-8 py-3 bg-blue-text text-gray-900 rounded-xl hover:bg-blue-text/90 transition-colors font-medium cursor-pointer"
                    >
                      View Proposals
                    </button>
                  </>
                ) : (
                  /* Default success action for voting/other transactions */
                  <button
                    onClick={handleClose}
                    className="px-8 py-3 bg-blue-text text-gray-900 rounded-xl hover:bg-blue-text/90 transition-colors font-medium cursor-pointer"
                  >
                    Close
                  </button>
                )}
              </>
            )}

            {currentState === "error" && (
              <>
                <button
                  onClick={handleClose}
                  className="px-6 py-3 bg-neutral-700 text-neutral-200 rounded-xl hover:bg-neutral-600 transition-colors font-medium cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  onClick={handleConfirm}
                  className="px-8 py-3 bg-blue-text text-gray-900 rounded-xl hover:bg-blue-text/90 transition-colors font-medium cursor-pointer"
                >
                  Try Again
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
