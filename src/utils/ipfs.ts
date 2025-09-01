// Utility functions for IPFS operations
import { createHelia } from 'helia'
import { strings } from '@helia/strings'

// Singleton Helia instance to avoid creating multiple instances
let heliaInstance: any = null;
let stringHeliaInstance: any = null;

/**
 * Get or create a Helia instance
 */
async function getHelia() {
  if (!heliaInstance) {
    heliaInstance = await createHelia();
    stringHeliaInstance = strings(heliaInstance);
  }
  return { helia: heliaInstance, strings: stringHeliaInstance };
}

/**
 * Upload content to IPFS using Helia
 * @param content The content to upload
 * @returns The IPFS CID as a string
 */
export async function uploadToIPFS(content: string): Promise<string> {
  try {
    const { strings: stringInstance } = await getHelia();
    const cid = await stringInstance.add(content);
    return cid.toString();
  } catch (error) {
    console.error('Failed to upload to IPFS:', error);
    throw new Error(`IPFS upload failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

/**
 * Fetch content from IPFS using Helia with fallback to gateway
 * @param ipfsHash The IPFS hash to fetch
 * @returns The content as a string
 */
export async function fetchFromIPFS(ipfsHash: string): Promise<string> {
  if (!ipfsHash || ipfsHash.trim() === '') {
    return '';
  }

  // Clean the hash (remove ipfs:// prefix if present)
  const cleanHash = ipfsHash.replace(/^ipfs:\/\//, '');
  
  try {
    // First try using Helia for direct IPFS access
    const { strings: stringInstance } = await getHelia();
    // Use any type to avoid TypeScript issues with multiformats
    const { CID } = await import('multiformats/cid') as any;
    const cid = CID.parse(cleanHash);
    const content = await stringInstance.get(cid);
    return content;
  } catch (heliaError) {
    console.warn('Failed to fetch from IPFS via Helia, falling back to gateway:', heliaError);
    
    // Fallback to Pinata gateway
    try {
      const response = await fetch(`https://gateway.pinata.cloud/ipfs/${cleanHash}`, {
        method: 'GET',
        headers: {
          'Accept': 'text/plain,application/json,*/*',
        },
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch from IPFS gateway: ${response.status} ${response.statusText}`);
      }

      const content = await response.text();
      return content;
    } catch (gatewayError) {
      console.error('Failed to fetch from IPFS gateway:', gatewayError);
      // Return the hash itself as final fallback
      return ipfsHash;
    }
  }
}

/**
 * Check if a string looks like an IPFS hash using CID validation
 * @param str The string to check
 * @returns True if it looks like an IPFS hash
 */
export async function isIPFSHash(str: string): Promise<boolean> {
  if (!str) return false;
  
  // Clean the string
  const cleanStr = str.replace(/^ipfs:\/\//, '');
  
  try {
    // Try to parse as CID
    const { CID } = await import('multiformats/cid') as any;
    CID.parse(cleanStr);
    return true;
  } catch {
    // If CID parsing fails, fall back to regex patterns
    return isIPFSHashSync(cleanStr);
  }
}

/**
 * Synchronous version of isIPFSHash for immediate checks
 * @param str The string to check
 * @returns True if it looks like an IPFS hash
 */
export function isIPFSHashSync(str: string): boolean {
  if (!str) return false;
  
  // Clean the string
  const cleanStr = str.replace(/^ipfs:\/\//, '');
  
  // Check for common IPFS hash patterns
  // CID v0: Qm... (46 characters, base58)
  // CID v1: b... or z... (variable length, base32 or base58)
  const cidV0Pattern = /^Qm[1-9A-HJ-NP-Za-km-z]{44}$/;
  const cidV1Pattern = /^[bz][a-z2-7]{58,}$/;
  
  return cidV0Pattern.test(cleanStr) || cidV1Pattern.test(cleanStr);
}

/**
 * Format IPFS hash for display
 * @param hash The IPFS hash
 * @returns Formatted hash for display
 */
export function formatIPFSHash(hash: string): string {
  if (!hash) return '';
  
  const cleanHash = hash.replace(/^ipfs:\/\//, '');
  
  if (cleanHash.length > 20) {
    return `${cleanHash.substring(0, 10)}...${cleanHash.substring(cleanHash.length - 10)}`;
  }
  
  return cleanHash;
}
