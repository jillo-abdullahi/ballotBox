import { useEffect, useState } from 'react';
import { CiLock, CiCircleCheck } from "react-icons/ci";
import { MdErrorOutline } from "react-icons/md";
import { useVoting } from "../hooks/useVoting";

interface VoteModalProps {
  isOpen: boolean;
  onClose: () => void;
  proposalId: number;
  voteValue: boolean; // true = yes, false = no
  onSuccess?: () => void; // Callback when vote is successful
}

export default function VoteModal({
  isOpen,
  onClose,
  proposalId,
  voteValue,
  onSuccess,
}: VoteModalProps) {
  const [hasStarted, setHasStarted] = useState(false);
  const [showDelayWarning, setShowDelayWarning] = useState(false);

  // Voting hook - only exists when modal is mounted
  const {
    vote: submitVote,
    isPending,
    isConfirming,
    isConfirmed,
    error,
  } = useVoting(proposalId);

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

  // Show delay warning after 30 seconds of confirming
  useEffect(() => {
    let timeoutId: NodeJS.Timeout;
    
    if (isConfirming) {
      timeoutId = setTimeout(() => {
        setShowDelayWarning(true);
      }, 30000); // 30 seconds
    } else {
      setShowDelayWarning(false);
    }

    return () => {
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
    };
  }, [isConfirming]);

  useEffect(() => {
    if (isConfirmed) {
      // Call success callback if provided
      onSuccess?.();
      
      // Reset delay warning
      setShowDelayWarning(false);
      
      // Auto-close after success
      setTimeout(() => {
        onClose();
        setHasStarted(false);
      }, 2000);
    }
  }, [isConfirmed, onClose, onSuccess]);

  const handleConfirm = async () => {
    try {
      await submitVote(voteValue);
    } catch (err) {
      // Error is handled by the hook
      console.error('Vote failed:', err);
    }
  };

  const handleClose = () => {
    if (isPending || isConfirming) {
      return; // Don't allow closing during transaction
    }
    onClose();
    setHasStarted(false);
    setShowDelayWarning(false);
  };

  if (!isOpen) return null;

  // Determine current state
  let currentState: 'idle' | 'pending' | 'confirming' | 'success' | 'error' = 'idle';
  if (error) currentState = 'error';
  else if (isConfirmed) currentState = 'success';
  else if (isConfirming) currentState = 'confirming';
  else if (isPending) currentState = 'pending';

  const voteText = voteValue ? "Yes" : "No";

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
        {currentState !== 'pending' && currentState !== 'confirming' && (
          <button
            onClick={handleClose}
            className="absolute top-4 right-4 text-neutral-400 hover:text-neutral-200 transition-colors cursor-pointer"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        )}

        <div className="text-center">
          {/* Icon based on state */}
          <div className="w-16 h-16 mx-auto rounded-full flex items-center justify-center">
            {currentState === 'idle' && (
              <CiLock className="absolute w-8 h-8 text-blue-text" />
            )}
            
            {(currentState === 'pending' || currentState === 'confirming') && (
              <div className="bg-transparent">
                <div className="w-8 h-8 border-2 border-teal-text/30 border-t-teal-text rounded-full animate-spin" />
              </div>
            )}
            
            {currentState === 'success' && (
              <CiCircleCheck className="w-8 h-8 text-green-500" />
            )}
            
            {currentState === 'error' && (
              <MdErrorOutline className="absolute w-8 h-8 text-red-text" />
            )}
          </div>

          {/* Title and description based on state */}
          {currentState === 'idle' && (
            <>
              <h3 className="text-xl font-bold text-blue-text mb-4">Vote {voteText}</h3>
              <p className="text-neutral-300 mb-8 leading-relaxed">
                You're about to vote "{voteText}" on this proposal. This will require a transaction to be confirmed in your wallet.
              </p>
            </>
          )}
          
          {currentState === 'pending' && (
            <>
              <h3 className="text-xl font-bold text-teal-text mb-4">Confirm Transaction</h3>
              <p className="text-neutral-300 mb-8 leading-relaxed">
                Please confirm the transaction in your wallet to proceed.
              </p>
            </>
          )}
          
          {currentState === 'confirming' && (
            <>
              <h3 className="text-xl font-bold text-teal-text mb-4">Processing Transaction</h3>
              <p className="text-neutral-300 mb-4 leading-relaxed">
                Your transaction is being processed on the blockchain. Please wait...
              </p>
              {showDelayWarning && (
                <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-xl p-4 mb-4">
                  <div className="flex items-start gap-3">
                    <div className="w-5 h-5 text-yellow-500 flex-shrink-0 mt-0.5">
                      <svg fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <div>
                      <h4 className="text-yellow-500 font-medium mb-1">Transaction Delayed</h4>
                      <p className="text-yellow-200 text-sm leading-relaxed">
                        Your transaction is taking longer than usual. This can happen during network congestion. 
                        The transaction will complete automatically - please don't close this window or submit again.
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </>
          )}
          
          {currentState === 'success' && (
            <>
              <h3 className="text-xl font-bold text-green-500 mb-4">Vote Submitted!</h3>
              <p className="text-neutral-300 mb-8 leading-relaxed">
                Your "{voteText}" vote has been successfully recorded on the blockchain.
              </p>
            </>
          )}
          
          {currentState === 'error' && (
            <>
              <h3 className="text-xl font-bold text-red-text mb-4">Vote Failed</h3>
              <p className="text-neutral-300 mb-8 leading-relaxed">
                Your vote could not be completed. This might be due to network issues, insufficient funds, or the transaction was rejected.
              </p>
            </>
          )}

          {/* Action buttons */}
          <div className="flex gap-4 justify-center">
            {currentState === 'idle' && (
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
                  Confirm Vote
                </button>
              </>
            )}
            
            {currentState === 'error' && (
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
