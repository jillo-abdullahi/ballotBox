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
    
    // Upload details to IPFS if there are any details
    let detailsHash: `0x${string}` = '0x0000000000000000000000000000000000000000000000000000000000000000';
    if (args.details.trim()) {
      try {
        const ipfsHash = await uploadToIPFS(args.details);
        console.log('Details uploaded to IPFS:', ipfsHash);
        
        // Convert IPFS CID to bytes32 format
        // For now, we'll create a simple hash from the CID
        // In production, you might want to use a more sophisticated approach
        const encoder = new TextEncoder();
        const data = encoder.encode(ipfsHash);
        const hashArray = new Uint8Array(32);
        
        // Copy the data, truncating or padding as needed
        const copyLength = Math.min(data.length, 32);
        hashArray.set(data.slice(0, copyLength));
        
        // Convert to hex string
        detailsHash = `0x${Array.from(hashArray)
          .map(b => b.toString(16).padStart(2, '0'))
          .join('')}` as `0x${string}`;
          
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
