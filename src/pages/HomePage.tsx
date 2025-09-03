import { useState, useEffect, useMemo } from "react";
import { useReadContract, useAccount } from "wagmi";
import { BALLOTBOX_ADDRESS, BALLOTBOX_ABI } from "../config/contract";
import InfoSection from "../components/InfoSection";
import ProposalsList from "../components/ProposalsList";
import ProposalsListSkeleton from "../components/ProposalsListSkeleton";
import ProposalsFilters, {
  type FilterType,
} from "../components/ProposalsFilters";
import { fetchFromIPFS, getIPFSHashFromBytes32 } from "../utils/ipfs";
import { useDebounce } from "../hooks/useDebounce";

interface ContractProposal {
  id: bigint;
  author: `0x${string}`;
  yesVotes: bigint;
  noVotes: bigint;
  createdAt: number;
  deadline: number;
  active: boolean;
  title: string;
  description: string;
  detailsHash: `0x${string}`;
}

interface DisplayProposal {
  id: number;
  title: string;
  description: string;
  details?: string;
  author: string;
  createdAt: number;
  deadline: number;
  yes: number;
  no: number;
}

export default function HomePage() {
  const { address } = useAccount();

  // pagination state
  const [page, setPage] = useState(1);
  const perPage = 6;
  const [proposals, setProposals] = useState<DisplayProposal[]>([]);
  const [isLoadingProposals, setIsLoadingProposals] = useState(true);

  // Filter state
  const [filterType, setFilterType] = useState<FilterType>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const debouncedSearchQuery = useDebounce(searchQuery, 300);

  // Fetch total count based on filter type
  const { data: totalCount, isLoading: isLoadingCount } = useReadContract({
    address: BALLOTBOX_ADDRESS,
    abi: BALLOTBOX_ABI,
    functionName:
      filterType === "all" ? "proposalCount" : "getAuthorProposalCount",
    args: filterType === "my" && address ? [address] : undefined,
    query: {
      enabled: filterType === "all" || (filterType === "my" && !!address),
    },
  });

  // Calculate pagination for contract calls - load all if searching, paginate if not
  const shouldLoadAll = !!debouncedSearchQuery.trim();
  const startIndex = shouldLoadAll 
    ? 0 
    : (page - 1) * perPage;
  const endIndex = shouldLoadAll 
    ? Number(totalCount || 0) 
    : Math.min(Number(totalCount || 0), page * perPage);
  const loadCount = shouldLoadAll 
    ? Number(totalCount || 0) 
    : endIndex - startIndex;

  // Fetch proposals based on filter type and search state
  const { data: contractProposals, isLoading: isLoadingContractProposals } =
    useReadContract({
      address: BALLOTBOX_ADDRESS,
      abi: BALLOTBOX_ABI,
      functionName:
        filterType === "all" ? "getProposals" : "getProposalsByAuthor",
      args:
        filterType === "all"
          ? [BigInt(startIndex), BigInt(loadCount)]
          : address
          ? [address, BigInt(startIndex), BigInt(loadCount)]
          : undefined,
      query: {
        enabled:
          (filterType === "all" && !!totalCount && Number(totalCount) > 0) ||
          (filterType === "my" && !!address && totalCount !== undefined),
      },
    });

  // Process contract data and fetch IPFS content
  useEffect(() => {
    async function processProposals() {
      if (!contractProposals) {
        // If contractProposals is undefined/null and we're on 'my' filter with 0 count, clear proposals
        if (filterType === "my" && Number(totalCount || 0) === 0) {
          setProposals([]);
          setIsLoadingProposals(false);
        }
        return;
      }

      setIsLoadingProposals(true);

      try {
        const processed = await Promise.all(
          (contractProposals as readonly ContractProposal[]).map(
            async (proposal) => {
              let details = "";

              // Try to get the original IPFS hash from the bytes32 detailsHash
              const originalIPFSHash = getIPFSHashFromBytes32(
                proposal.detailsHash
              );

              if (originalIPFSHash) {
                try {
                  const ipfsContent = await fetchFromIPFS(originalIPFSHash);
                  details = ipfsContent || "";
                } catch (error) {
                  console.error("Failed to fetch IPFS content:", error);
                  // Keep empty as fallback
                }
              }

              return {
                id: Number(proposal.id),
                title: proposal.title,
                description: proposal.description,
                details,
                author: proposal.author,
                createdAt: proposal.createdAt,
                deadline: proposal.deadline,
                yes: Number(proposal.yesVotes),
                no: Number(proposal.noVotes),
              };
            }
          )
        );

        // Sort by creation time (newest first)
        processed.sort((a, b) => b.createdAt - a.createdAt);
        setProposals(processed);
        setIsLoadingProposals(false);
      } catch (error) {
        console.error("Error processing proposals:", error);
        setProposals([]);
        setIsLoadingProposals(false);
      }
    }

    processProposals();
  }, [contractProposals, filterType, totalCount]);

  // Filter proposals based on search query
  const filteredProposals = useMemo(() => {
    if (!debouncedSearchQuery.trim()) {
      return proposals;
    }

    const query = debouncedSearchQuery.toLowerCase().trim();
    
    return proposals.filter(
      (proposal) =>
        proposal.title.toLowerCase().includes(query) ||
        proposal.description.toLowerCase().includes(query) ||
        proposal.details?.toLowerCase().includes(query) ||
        proposal.id.toString().includes(query) ||
        proposal.author.toLowerCase().includes(query)
    );
  }, [proposals, debouncedSearchQuery]);

  // Reset to page 1 when filter changes or search query changes
  useEffect(() => {
    setPage(1);
    // Set loading state for filter type changes and search query changes
    if (filterType || debouncedSearchQuery) {
      setIsLoadingProposals(true);
    }
  }, [filterType, debouncedSearchQuery]);

  // Reset to 'all' filter if wallet disconnects and user was on 'my' filter
  useEffect(() => {
    if (filterType === "my" && !address) {
      setFilterType("all");
    }
  }, [address, filterType]);

  // Reset proposals when address changes and we're on 'my' filter
  useEffect(() => {
    if (filterType === "my") {
      setProposals([]);
    }
  }, [address, filterType]);

  const pageCount = Math.max(1, Math.ceil(Number(totalCount || 0) / perPage));
  const displayedProposals = debouncedSearchQuery
    ? filteredProposals
    : proposals;
  const displayedCount = debouncedSearchQuery
    ? filteredProposals.length
    : Number(totalCount || 0);

  // For search results, we need to paginate the filtered results
  const paginatedProposals = useMemo(() => {
    if (!debouncedSearchQuery) {
      return displayedProposals; // Already paginated by contract call
    }

    // Paginate filtered results
    const startIdx = (page - 1) * perPage;
    const endIdx = startIdx + perPage;
    return filteredProposals.slice(startIdx, endIdx);
  }, [
    debouncedSearchQuery,
    displayedProposals,
    filteredProposals,
    page,
    perPage,
  ]);

  const finalPageCount = debouncedSearchQuery
    ? Math.max(1, Math.ceil(filteredProposals.length / perPage))
    : pageCount;

  // Determine if we should show loading state
  const isLoading = debouncedSearchQuery
    ? (isLoadingCount || isLoadingContractProposals || isLoadingProposals) // Show loading when fetching all proposals for search
    : (isLoadingCount || isLoadingContractProposals || isLoadingProposals); // Normal loading for pagination

  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-100 w-full">
      {/* Content with improved layout */}
      <main className="mx-auto max-w-6xl px-4 py-8 space-y-8">
        <InfoSection />

        {/* Proposals section with persistent header and filters */}
        <section className="space-y-4">
          {/* Header with title and filters - always visible */}
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <h2 className="text-lg font-medium">
              {filterType === "my" ? "My proposals" : "Recent proposals"}
            </h2>

            {/* Filters */}
            <div className="flex justify-start md:justify-end">
              <ProposalsFilters
                filterType={filterType}
                onFilterTypeChange={setFilterType}
                searchQuery={searchQuery}
                onSearchChange={setSearchQuery}
              />
            </div>
          </div>

          {/* Count display - always visible */}
          <div className="flex items-center">
            <span className="text-sm font-medium text-blue-text bg-blue-bg px-3 py-1.5 rounded-xl border border-blue-text/10">
              {isLoading ? (
                <div className="animate-pulse flex items-center justify-center w-24 h-4" />
              ) : (
                `${displayedCount} ${
                  displayedCount === 1 ? "proposal" : "proposals"
                } found`
              )}
            </span>
          </div>

          {/* Proposals list content */}
          {isLoading ? (
            <ProposalsListSkeleton />
          ) : (
            <ProposalsList
              proposals={paginatedProposals}
              currentPage={page}
              totalPages={finalPageCount}
              onPageChange={setPage}
              filterType={filterType}
              searchQuery={debouncedSearchQuery}
            />
          )}
        </section>
      </main>
    </div>
  );
}
