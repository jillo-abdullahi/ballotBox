import { useEffect, useState } from "react";
import { CiLock, CiCircleCheck } from "react-icons/ci";
import { MdErrorOutline } from "react-icons/md";

interface TransactionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => Promise<void>;
  title: string;
  description: string;
}

type TransactionState = "idle" | "pending" | "confirming" | "success" | "error";

export default function TransactionModal({
  isOpen,
  onClose,
  onConfirm,
  title,
  description,
}: TransactionModalProps) {
  const [txState, setTxState] = useState<TransactionState>("idle");
  const [error, setError] = useState<string>("");

  useEffect(() => {
    if (isOpen) {
      setTxState("idle");
      setError("");
    }
  }, [isOpen]);

  const handleConfirm = async () => {
    try {
      setTxState("pending");
      setError("");

      // Simulate wallet confirmation prompt
      await new Promise((resolve) => setTimeout(resolve, 1000));

      setTxState("confirming");

      // Call the actual transaction
      await onConfirm();

      setTxState("success");

      // Auto-close after success
      setTimeout(() => {
        onClose();
      }, 2000);
    } catch (err) {
      setTxState("error");
      setError(err instanceof Error ? err.message : "Transaction failed");
    }
  };

  const handleClose = () => {
    if (txState === "pending" || txState === "confirming") {
      return; // Don't allow closing during transaction
    }
    onClose();
  };

  if (!isOpen) return null;

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
        {txState !== "pending" && txState !== "confirming" && (
          <button
            onClick={handleClose}
            className="absolute top-4 right-4 text-neutral-400 hover:text-neutral-200 transition-colors"
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
          <div className="w-16 h-16 mx-auto mb-6 rounded-full flex items-center justify-center">
            {txState === "idle" && (
              <CiLock className="absolute w-8 h-8 text-blue-text" />
            )}

            {(txState === "pending" || txState === "confirming") && (
              <div className="bg-transparent">
                <div className="w-8 h-8 border-2 border-teal-text/30 border-t-teal-text rounded-full animate-spin" />
              </div>
            )}

            {txState === "success" && (
              <CiCircleCheck className="w-8 h-8 text-green-500" />
            )}

            {txState === "error" && (
              <MdErrorOutline className="absolute w-8 h-8 text-red-text" />
            )}
          </div>

          {/* Title and description based on state */}
          {txState === "idle" && (
            <>
              <h3 className="text-xl font-bold text-blue-text mb-4">{title}</h3>
              <p className="text-neutral-300 mb-8 leading-relaxed">
                {description}
              </p>
            </>
          )}

          {txState === "pending" && (
            <>
              <h3 className="text-xl font-bold text-teal-text mb-4">
                Confirm Transaction
              </h3>
              <p className="text-neutral-300 mb-8 leading-relaxed">
                Please confirm the transaction in your wallet to proceed.
              </p>
            </>
          )}

          {txState === "confirming" && (
            <>
              <h3 className="text-xl font-bold text-teal-text mb-4">
                Processing Transaction
              </h3>
              <p className="text-neutral-300 mb-8 leading-relaxed">
                Your transaction is being processed. Please wait...
              </p>
            </>
          )}

          {txState === "success" && (
            <>
              <h3 className="text-xl font-bold text-green-500 mb-4">
                Transaction Successful!
              </h3>
              <p className="text-neutral-300 mb-8 leading-relaxed">
                Your proposal has been created successfully.
              </p>
            </>
          )}

          {txState === "error" && (
            <>
              <h3 className="text-xl font-bold text-red-text mb-4">
                Transaction Failed
              </h3>
              <p className="text-neutral-300 mb-8 leading-relaxed">
                {error || "The transaction was rejected or failed to process."}
              </p>
            </>
          )}

          {/* Action buttons */}
          <div className="flex gap-4 justify-center">
            {txState === "idle" && (
              <>
                <button
                  onClick={handleClose}
                  className="px-6 py-3 bg-neutral-700 text-neutral-200 rounded-xl hover:bg-neutral-600 transition-colors font-medium"
                >
                  Cancel
                </button>
                <button
                  onClick={handleConfirm}
                  className="px-8 py-3 bg-blue-text text-gray-900 rounded-xl hover:bg-blue-text/90 transition-colors font-medium"
                >
                  Confirm
                </button>
              </>
            )}

            {txState === "error" && (
              <>
                <button
                  onClick={handleClose}
                  className="px-6 py-3 bg-neutral-700 text-neutral-200 rounded-xl hover:bg-neutral-600 transition-colors font-medium"
                >
                  Cancel
                </button>
                <button
                  onClick={handleConfirm}
                  className="px-8 py-3 bg-blue-text text-gray-900 rounded-xl hover:bg-blue-text/90 transition-colors font-medium"
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
