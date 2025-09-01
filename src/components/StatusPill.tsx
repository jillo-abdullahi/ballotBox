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
      className={`text-xs px-2 py-1 rounded-full border-none ${
        isOpen ? "bg-blue-bg text-blue-text" : "bg-red-bg text-red-text"
      } ${className}`}
    >
      {isOpen ? "Open" : "Closed"}
    </span>
  );
}
