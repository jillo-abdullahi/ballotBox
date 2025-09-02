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
  const cidV0Pattern = /^Qm[1-9A-HJ-NP-Za-km-z]{44}$/;
  
  // CID v1: various patterns
  const cidV1Patterns = [
    /^bafkrei[a-z0-9]{50}$/, // CIDv1 with sha256 hash (like your example)
    /^bafyrei[a-z0-9]{50}$/, // Alternative CIDv1 format
    /^bafkreig[a-z0-9]{49}$/, // Another CIDv1 variant
    /^bafy[a-z0-9]{55}$/, // Directory CIDv1
    /^b[a-z2-7]{58,}$/, // General CIDv1 base32
    /^z[1-9A-HJ-NP-Za-km-z]+$/ // CIDv1 base58btc
  ];
  
  // Check CID v0
  if (cidV0Pattern.test(cleanStr)) {
    return true;
  }
  
  // Check CID v1 patterns
  for (const pattern of cidV1Patterns) {
    if (pattern.test(cleanStr)) {
      return true;
    }
  }
  
  return false;
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

/**
 * Retrieve the original IPFS hash from a bytes32 hash stored on the blockchain
 * This function handles the reverse conversion from our storage format
 */
export function getIPFSHashFromBytes32(bytes32Hash: string): string | null {
  if (!bytes32Hash || bytes32Hash === '0x0000000000000000000000000000000000000000000000000000000000000000') {
    return null;
  }

  // First, try to get from localStorage (our mapping approach)
  const storedHash = localStorage.getItem(`ipfs_hash_${bytes32Hash}`);
  if (storedHash) {
    console.log('Retrieved IPFS hash from localStorage:', storedHash);
    return storedHash;
  }

  // Fallback: try to decode the bytes32 back to a string
  try {
    // Remove '0x' prefix and convert hex to bytes
    const hexString = bytes32Hash.slice(2);
    const bytes = new Uint8Array(32);
    
    for (let i = 0; i < 32; i++) {
      bytes[i] = parseInt(hexString.slice(i * 2, i * 2 + 2), 16);
    }
    
    // Find the end of the actual data (before null bytes)
    let actualLength = 32;
    for (let i = 31; i >= 0; i--) {
      if (bytes[i] !== 0) {
        actualLength = i + 1;
        break;
      }
    }
    
    // Convert back to string
    const decoder = new TextDecoder();
    const hashPart = decoder.decode(bytes.slice(0, actualLength));
    
    // Reconstruct the full IPFS hash for CIDv1
    if (hashPart.length > 0) {
      const fullHash = `bafkrei${hashPart}`;
      
      // Validate the reconstructed hash
      if (isIPFSHashSync(fullHash)) {
        console.log('Reconstructed IPFS hash:', fullHash);
        return fullHash;
      }
    }
    
    console.warn('Could not reconstruct valid IPFS hash from bytes32:', bytes32Hash);
    return null;
  } catch (error) {
    console.error('Error decoding bytes32 to IPFS hash:', error);
    return null;
  }
}
