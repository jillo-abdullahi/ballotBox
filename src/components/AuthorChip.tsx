import Jazzicon from 'react-jazzicon'



interface AuthorChipProps {
  author: string
  className?: string
}

export default function AuthorChip({ author, className = "" }: AuthorChipProps) {
  // Convert string to number for Jazzicon seed
  const hashCode = (str: string) => {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // Convert to 32bit integer
    }
    return Math.abs(hash);
  };

  // Format address to show first 6 and last 4 characters
  const formatAddress = (address: string) => {
    if (!address || address.length < 10) return address;
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  return (
    <div className={`flex items-center border-none shrink-0 rounded-full pl-2 pr-3 py-1 w-fit ${className}`}>
      <Jazzicon diameter={10} seed={hashCode(author)} />
      <span className="ml-2 text-neutral-400 font-semibold text-xs">{formatAddress(author)}</span>
    </div>
  )
}
