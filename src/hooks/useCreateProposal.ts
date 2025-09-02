import { useWriteContract, useWaitForTransactionReceipt } from 'wagmi';
import { BALLOTBOX_ADDRESS, BALLOTBOX_ABI } from '../config/contract';
import { uploadToIPFS } from '../utils/ipfs';

export interface CreateProposalArgs {
  title: string;
  description: string;
  details: string; // Raw details text that will be uploaded to IPFS
  deadline: string; // ISO string that will be converted to timestamp
}

export function useCreateProposal() {
  const {
    data: hash,
    error,
    isPending,
    writeContract
  } = useWriteContract();

  const {
    isLoading: isConfirming,
    isSuccess: isConfirmed,
    error: confirmError
  } = useWaitForTransactionReceipt({
    hash,
  });

  const createProposal = async (args: CreateProposalArgs) => {
    // Convert ISO date string to Unix timestamp (uint32)
    const deadline = Math.floor(new Date(args.deadline).getTime() / 1000);
    
    // Store details using our simplified approach
    let detailsHash: `0x${string}` = '0x0000000000000000000000000000000000000000000000000000000000000000';
    if (args.details.trim()) {
      try {
        const contentId = await uploadToIPFS(args.details);
        console.log('Details stored with ID:', contentId);
        
        // Convert content ID to bytes32 for blockchain storage
        const encoder = new TextEncoder();
        const data = encoder.encode(contentId);
        const hashArray = new Uint8Array(32);
        
        // Copy the data, truncating if too long
        const copyLength = Math.min(data.length, 32);
        hashArray.set(data.slice(0, copyLength));
        
        // Convert to hex string
        detailsHash = `0x${Array.from(hashArray)
          .map(b => b.toString(16).padStart(2, '0'))
          .join('')}` as `0x${string}`;
        
        // Store the mapping for retrieval (simplified approach)
        localStorage.setItem(`content_id_${detailsHash}`, contentId);
        console.log('Stored content mapping:', detailsHash, '->', contentId);
          
      } catch (uploadError) {
        console.error('IPFS upload failed:', uploadError);
        throw new Error(`Failed to upload proposal details: ${uploadError instanceof Error ? uploadError.message : 'Unknown error'}`);
      }
    }
    
    return writeContract({
      address: BALLOTBOX_ADDRESS,
      abi: BALLOTBOX_ABI,
      functionName: 'createProposal',
      args: [args.title, args.description, detailsHash, deadline]
    });
  };

  return {
    createProposal,
    hash,
    isPending,
    isConfirming,
    isConfirmed,
    error: error || confirmError
  };
}
