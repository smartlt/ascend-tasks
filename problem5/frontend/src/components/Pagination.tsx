interface PaginationProps {
  currentPage: number;
  totalPages: number;
  startItem: number;
  endItem: number;
  total: number;
  itemsPerPage: number;
  onPageChange: (page: number) => void;
  onLimitChange: (limit: number) => void;
}

export default function Pagination({
  currentPage,
  totalPages,
  startItem,
  endItem,
  total,
  itemsPerPage,
  onPageChange,
  onLimitChange,
}: PaginationProps) {
  const limitOptions = [2, 5, 10, 20, 50, 100];

  if (total === 0) return null;

  return (
    <div className="px-4 sm:px-6 py-4 border-t border-gray-200">
      {/* Items per page selector */}
      <div className="mb-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center space-x-2">
          <label
            htmlFor="itemsPerPage"
            className="text-sm text-gray-700 whitespace-nowrap"
          >
            Items per page:
          </label>
          <select
            id="itemsPerPage"
            value={itemsPerPage}
            onChange={(e) => onLimitChange(Number(e.target.value))}
            className="px-2 py-1 text-sm border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent text-black"
          >
            {limitOptions.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        </div>
        <div className="text-sm text-gray-700">
          Showing <span className="font-medium">{startItem}</span> to{" "}
          <span className="font-medium">{endItem}</span> of{" "}
          <span className="font-medium">{total}</span> results
        </div>
      </div>

      {/* Page navigation */}
      {totalPages > 1 && (
        <nav className="flex items-center justify-center space-x-1 sm:space-x-2 text-black">
          <button
            onClick={() => onPageChange(currentPage - 1)}
            disabled={currentPage === 0}
            className="px-2 sm:px-3 py-1 text-sm border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <span className="hidden sm:inline">Previous</span>
            <span className="sm:hidden">‹</span>
          </button>
          {[
            ...Array(Math.min(totalPages, window.innerWidth < 640 ? 5 : 10)),
          ].map((_, index) => {
            // Show fewer pages on mobile
            const maxPages = window.innerWidth < 640 ? 5 : 10;
            let pageNumber;
            if (totalPages <= maxPages) {
              pageNumber = index;
            } else if (currentPage < Math.floor(maxPages / 2)) {
              pageNumber = index;
            } else if (currentPage > totalPages - Math.ceil(maxPages / 2)) {
              pageNumber = totalPages - maxPages + index;
            } else {
              pageNumber = currentPage - Math.floor(maxPages / 2) + index;
            }

            if (pageNumber < 0 || pageNumber >= totalPages) return null;

            return (
              <button
                key={pageNumber}
                onClick={() => onPageChange(pageNumber)}
                className={`px-2 sm:px-3 py-1 text-sm border rounded-md ${
                  currentPage === pageNumber
                    ? "bg-blue-600 border-blue-600 text-white"
                    : "border-gray-300 hover:bg-gray-50"
                }`}
              >
                {pageNumber + 1}
              </button>
            );
          })}
          <button
            onClick={() => onPageChange(currentPage + 1)}
            disabled={currentPage === totalPages - 1}
            className="px-2 sm:px-3 py-1 text-sm border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <span className="hidden sm:inline">Next</span>
            <span className="sm:hidden">›</span>
          </button>
        </nav>
      )}
    </div>
  );
}
