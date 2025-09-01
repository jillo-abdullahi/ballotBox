import { useEffect, useState } from 'react';
import { CiLock, CiCircleCheck } from "react-icons/ci";
import { MdErrorOutline } from "react-icons/md";

interface ContractTransactionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => Promise<void>;
  title: string;
  description: string;
  isPending: boolean;
  isConfirming: boolean;
  isConfirmed: boolean;
  error: Error | null;
}

export default function ContractTransactionModal({
  isOpen,
  onClose,
  onConfirm,
  title,
  description,
  isPending,
  isConfirming,
  isConfirmed,
  error,
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

  useEffect(() => {
    if (isConfirmed) {
      // Auto-close after success
      setTimeout(() => {
        onClose();
        setHasStarted(false);
      }, 2000);
    }
  }, [isConfirmed, onClose]);

  const handleConfirm = async () => {
    try {
      await onConfirm();
    } catch (err) {
      // Error is handled by the hook
      console.error('Transaction failed:', err);
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
  let currentState: 'idle' | 'pending' | 'confirming' | 'success' | 'error' = 'idle';
  if (error) currentState = 'error';
  else if (isConfirmed) currentState = 'success';
  else if (isConfirming) currentState = 'confirming';
  else if (isPending) currentState = 'pending';

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
            className="absolute top-4 right-4 text-neutral-400 hover:text-neutral-200 transition-colors"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        )}

        <div className="text-center">
          {/* Icon based on state */}
          <div className="w-16 h-16 mx-auto mb-6 rounded-full flex items-center justify-center">
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
              <h3 className="text-xl font-bold text-blue-text mb-4">{title}</h3>
              <p className="text-neutral-300 mb-8 leading-relaxed">{description}</p>
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
              <p className="text-neutral-300 mb-8 leading-relaxed">
                Your transaction is being processed on the blockchain. Please wait...
              </p>
            </>
          )}
          
          {currentState === 'success' && (
            <>
              <h3 className="text-xl font-bold text-green-500 mb-4">Transaction Successful!</h3>
              <p className="text-neutral-300 mb-8 leading-relaxed">
                Your proposal has been created successfully and is now live on the blockchain.
              </p>
            </>
          )}
          
          {currentState === 'error' && (
            <>
              <h3 className="text-xl font-bold text-red-text mb-4">Transaction Failed</h3>
              <p className="text-neutral-300 mb-8 leading-relaxed">
                {error?.message || 'The transaction was rejected or failed to process.'}
              </p>
            </>
          )}

          {/* Action buttons */}
          <div className="flex gap-4 justify-center">
            {currentState === 'idle' && (
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
            
            {currentState === 'error' && (
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
