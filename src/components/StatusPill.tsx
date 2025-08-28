interface StatusPillProps {
  isOpen: boolean;
  className?: string;
}

export default function StatusPill({ isOpen, className = "" }: StatusPillProps) {
  return (
    <span
      className={`text-xs px-2 py-1 rounded-full border-none ${
        isOpen
          ? "bg-blue-500 text-gray-900"
          : "bg-red-900/10 text-red-800"
      } ${className}`}
    >
      {isOpen ? "Open" : "Closed"}
    </span>
  );
}
