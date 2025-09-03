import { useState, useRef, useEffect } from "react";
import { useAccount } from "wagmi";
import { IoChevronDown } from "react-icons/io5";

export type FilterType = "all" | "my";

interface ProposalsFiltersProps {
  filterType: FilterType;
  onFilterTypeChange: (filter: FilterType) => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
}

export default function ProposalsFilters({
  filterType,
  onFilterTypeChange,
  searchQuery,
  onSearchChange,
}: ProposalsFiltersProps) {
  const { isConnected } = useAccount();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsDropdownOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const filterOptions = [
    { value: "all" as FilterType, label: "All Proposals", disabled: false },
    {
      value: "my" as FilterType,
      label: isConnected ? "My Proposals" : "My Proposals (Connect Wallet)",
      disabled: !isConnected,
    },
  ];

  const selectedOption = filterOptions.find(
    (option) => option.value === filterType
  );

  return (
    <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
      {/* Custom Filter Dropdown */}
      <div className="relative" ref={dropdownRef}>
        <button
          onClick={() => setIsDropdownOpen(!isDropdownOpen)}
          className="appearance-none bg-blue-bg/50 border border-blue-text/50 rounded-xl px-3 py-2 text-sm text-neutral-500 focus:outline-none focus:ring-2 focus:ring-blue-text/50 focus:border-transparent cursor-pointer min-w-[140px] w-full sm:w-auto flex items-center justify-between hover:bg-blue-bg/60 transition-colors"
        >
          <span>{selectedOption?.label}</span>

          <IoChevronDown
            className={`w-4 h-4 text-neutral-500 transition-transform ${
              isDropdownOpen ? "rotate-180" : ""
            }`}
          />
        </button>

        {/* Dropdown Options */}
        {isDropdownOpen && (
          <div className="absolute top-full mt-2 left-0 mt-1 w-full bg-blue-bg/50 backdrop-blur-lg border border-blue-text/50 rounded-xl shadow-lg z-10 overflow-hidden">
            {filterOptions.map((option) => (
              <button
                key={option.value}
                onClick={() => {
                  if (!option.disabled) {
                    onFilterTypeChange(option.value);
                    setIsDropdownOpen(false);
                  }
                }}
                disabled={option.disabled}
                className={`cursor-pointer w-full text-left px-3 py-2 text-sm transition-colors ${
                  option.disabled
                    ? "text-neutral-500 cursor-not-allowed"
                    : option.value === filterType
                    ? "bg-blue-text/10 text-blue-text"
                    : "text-neutral-100 hover:bg-blue-bg"
                }`}
              >
                {option.label}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Search Field */}
      <div className="relative w-full sm:w-64">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <svg
            className="h-4 w-4 text-neutral-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
        </div>
        <input
          type="text"
          placeholder="Search proposals..."
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          className="w-full pl-10 pr-10 py-2 text-sm bg-blue-bg/50 border border-blue-text/50 rounded-xl text-neutral-100 placeholder-neutral-500 focus:outline-none focus:ring-2 focus:ring-blue-text/50 focus:border-transparent"
        />

        {/* Clear search button */}
        {searchQuery && (
          <button
            onClick={() => onSearchChange("")}
            className="absolute inset-y-0 right-0 pr-3 flex items-center text-neutral-400 hover:text-neutral-200 transition-colors"
          >
            <svg
              className="h-4 w-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        )}
      </div>
    </div>
  );
}
