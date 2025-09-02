// Utility functions for proposal details storage
// Simple approach: store short content directly in bytes32, use hash for longer content

/**
 * Store content using a simple, direct approach
 * @param content The content to store
 * @returns An identifier for the content
 */
export async function uploadToIPFS(content: string): Promise<string> {
  try {
    if (!content || content.trim() === '') {
      return 'empty';
    }

    // For short content (< 31 bytes), we can store it directly in bytes32
    const contentBytes = new TextEncoder().encode(content);
    
    if (contentBytes.length <= 31) {
      // Return the content itself - it will fit in bytes32
      console.log('Short content, will store directly in bytes32:', content);
      return `direct:${content}`;
    }

    // For longer content, create a simple hash and store in localStorage as fallback
    const hash = generateSimpleHash(content);
    localStorage.setItem(`content_${hash}`, content);
    console.log('Long content stored with hash:', hash);
    
    return `hash:${hash}`;
  } catch (error) {
    console.error('Failed to store content:', error);
    throw new Error(`Content storage failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

/**
 * Generate a simple hash for content
 */
function generateSimpleHash(content: string): string {
  let hash = 0;
  for (let i = 0; i < content.length; i++) {
    const char = content.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32bit integer
  }
  return Math.abs(hash).toString(36);
}

/**
 * Fetch content using our simple approach
 * @param identifier The content identifier
 * @returns The content as a string
 */
export async function fetchFromIPFS(identifier: string): Promise<string> {
  if (!identifier || identifier.trim() === '' || identifier === 'empty') {
    return '';
  }

  try {
    // Handle direct content storage
    if (identifier.startsWith('direct:')) {
      const content = identifier.replace('direct:', '');
      console.log('Retrieved direct content:', content);
      return content;
    }

    // Handle hash-based storage
    if (identifier.startsWith('hash:')) {
      const hash = identifier.replace('hash:', '');
      const content = localStorage.getItem(`content_${hash}`);
      
      if (content) {
        console.log('Retrieved content from localStorage for hash:', hash);
        return content;
      } else {
        console.warn('Content not found in localStorage for hash:', hash);
        return '';
      }
    }

    // Handle legacy formats
    if (identifier.startsWith('short:') || identifier.startsWith('stored:')) {
      console.log('Legacy identifier format detected:', identifier);
      return '';
    }

    console.warn('Unknown identifier format:', identifier);
    return '';
  } catch (error) {
    console.error('Failed to fetch content:', error);
    return '';
  }
}

/**
 * Check if a string is a valid content identifier
 * @param str The string to check
 * @returns True if it's a valid identifier
 */
export async function isIPFSHash(str: string): Promise<boolean> {
  return isIPFSHashSync(str);
}

/**
 * Check if a string is a valid content identifier (synchronous)
 * @param str The string to check
 * @returns True if it's a valid identifier
 */
export function isIPFSHashSync(str: string): boolean {
  if (!str) return false;
  
  // Clean the string
  const cleanStr = str.replace(/^ipfs:\/\//, '');
  
  // Check for our storage formats
  if (cleanStr.startsWith('direct:') || cleanStr.startsWith('hash:')) {
    return true;
  }
  
  // Check for legacy storage formats
  if (cleanStr.startsWith('short:') || cleanStr.startsWith('stored:')) {
    return true;
  }
  
  // Legacy IPFS hash patterns (for backward compatibility)
  const cidV0Pattern = /^Qm[1-9A-HJ-NP-Za-km-z]{44}$/;
  const cidV1Patterns = [
    /^bafkrei[a-z0-9]{50}$/,
    /^bafyrei[a-z0-9]{50}$/,
    /^bafkreig[a-z0-9]{49}$/,
    /^bafy[a-z0-9]{55}$/,
    /^b[a-z2-7]{58,}$/,
    /^z[1-9A-HJ-NP-Za-km-z]+$/
  ];
  
  if (cidV0Pattern.test(cleanStr)) {
    return true;
  }
  
  for (const pattern of cidV1Patterns) {
    if (pattern.test(cleanStr)) {
      return true;
    }
  }
  
  return false;
}

/**
 * Format content identifier for display
 * @param identifier The content identifier
 * @returns Formatted identifier for display
 */
export function formatIPFSHash(identifier: string): string {
  if (!identifier) return '';
  
  const cleanIdentifier = identifier.replace(/^ipfs:\/\//, '');
  
  // Handle our storage formats
  if (cleanIdentifier.startsWith('direct:')) {
    return 'Direct content';
  }
  
  if (cleanIdentifier.startsWith('hash:')) {
    const hash = cleanIdentifier.replace('hash:', '');
    return `Content #${hash.substring(0, 8)}`;
  }
  
  // Handle legacy formats
  if (cleanIdentifier.startsWith('short:')) {
    return 'Short content';
  }
  
  if (cleanIdentifier.startsWith('stored:')) {
    const hash = cleanIdentifier.replace('stored:', '');
    return `Content #${hash.substring(0, 8)}`;
  }
  
  // For other identifiers, show a truncated version
  if (cleanIdentifier.length > 20) {
    return `${cleanIdentifier.substring(0, 10)}...${cleanIdentifier.substring(cleanIdentifier.length - 10)}`;
  }
  
  return cleanIdentifier;
}

/**
 * Retrieve content identifier from bytes32 hash stored on blockchain
 * Simple approach using direct string conversion
 */
export function getIPFSHashFromBytes32(bytes32Hash: string): string | null {
  if (!bytes32Hash || bytes32Hash === '0x0000000000000000000000000000000000000000000000000000000000000000') {
    return null;
  }

  // First, try to get from localStorage mapping (for hash-based content)
  const storedIdentifier = localStorage.getItem(`content_id_${bytes32Hash}`);
  if (storedIdentifier) {
    console.log('Retrieved content identifier from localStorage:', storedIdentifier);
    return storedIdentifier;
  }

  // Try to decode bytes32 to string directly
  try {
    const hexString = bytes32Hash.slice(2);
    const bytes = new Uint8Array(32);
    
    for (let i = 0; i < 32; i++) {
      bytes[i] = parseInt(hexString.slice(i * 2, i * 2 + 2), 16);
    }
    
    // Find actual data length (trim null bytes)
    let actualLength = 32;
    for (let i = 31; i >= 0; i--) {
      if (bytes[i] !== 0) {
        actualLength = i + 1;
        break;
      }
    }
    
    if (actualLength === 0) {
      return null;
    }
    
    // Convert to string
    const decoder = new TextDecoder();
    const decoded = decoder.decode(bytes.slice(0, actualLength));
    
    if (decoded && decoded.length > 0) {
      console.log('Successfully decoded content identifier:', decoded);
      return decoded;
    }
    
    return null;
  } catch (error) {
    console.error('Error decoding bytes32 to content identifier:', error);
    return null;
  }
}
