interface PaginationProps {
  currentPage: number
  totalPages: number
  onPageChange: (page: number) => void
}

const clamp = (n: number, min: number, max: number) => Math.max(min, Math.min(max, n))

export default function Pagination({ currentPage, totalPages, onPageChange }: PaginationProps) {
  return (
    <div className="mt-6 flex items-center justify-center gap-2">
      <button
        className="rounded-lg border border-neutral-800 bg-neutral-900 px-3 py-2 text-sm hover:bg-neutral-800 disabled:opacity-50"
        disabled={currentPage <= 1}
        onClick={() => onPageChange(clamp(currentPage - 1, 1, totalPages))}
      >
        Prev
      </button>
      <span className="text-sm text-neutral-300">
        Page {currentPage} / {totalPages}
      </span>
      <button
        className="rounded-lg border border-neutral-800 bg-neutral-900 px-3 py-2 text-sm hover:bg-neutral-800 disabled:opacity-50"
        disabled={currentPage >= totalPages}
        onClick={() => onPageChange(clamp(currentPage + 1, 1, totalPages))}
      >
        Next
      </button>
    </div>
  )
}
