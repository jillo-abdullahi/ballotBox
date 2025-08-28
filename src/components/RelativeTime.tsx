import { formatDistanceToNow } from 'date-fns'

interface RelativeTimeProps {
  date: string | number;
  className?: string;
}

export default function RelativeTime({ date, className = "" }: RelativeTimeProps) {
  // Handle both string dates and epoch timestamps
  const dateObj = typeof date === 'number' ? new Date(date * 1000) : new Date(date);
  const relativeTime = formatDistanceToNow(dateObj, { addSuffix: true });
  
  return (
    <span className={className} title={dateObj.toLocaleString()}>
      {relativeTime}
    </span>
  );
}
