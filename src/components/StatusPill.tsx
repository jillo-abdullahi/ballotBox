interface StatusPillProps {
  isOpen: boolean;
  className?: string;
}

export default function StatusPill({
  isOpen,
  className = "",
}: StatusPillProps) {
  return (
    <span
      className={`text-xs px-2 py-1 rounded-full border ${
        isOpen ? "border-blue-text/10 bg-blue-bg text-blue-text" : "border-red-text/10 bg-red-bg text-red-text"
      } ${className}`}
    >
      {isOpen ? "Open" : "Closed"}
    </span>
  );
}
