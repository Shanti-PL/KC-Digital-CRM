"use client";

export default function Pagination({
  currentPage,
  totalPages,
  totalItems,
  itemsPerPage,
  onPageChange,
}) {
  const startItem = (currentPage - 1) * itemsPerPage + 1;
  const endItem = Math.min(currentPage * itemsPerPage, totalItems);

  const getPageNumbers = () => {
    const pages = [];
    const maxVisiblePages = 5;

    if (totalPages <= maxVisiblePages) {
      // Show all pages if total pages is less than or equal to maxVisiblePages
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      // Show first page
      pages.push(1);

      if (currentPage <= 3) {
        // Show pages 2, 3, 4, ..., totalPages
        for (let i = 2; i <= 4; i++) {
          pages.push(i);
        }
        if (totalPages > 4) {
          pages.push("...");
          pages.push(totalPages);
        }
      } else if (currentPage >= totalPages - 2) {
        // Show pages 1, ..., totalPages-3, totalPages-2, totalPages-1, totalPages
        if (totalPages > 4) {
          pages.push("...");
        }
        for (let i = totalPages - 3; i <= totalPages; i++) {
          if (i > 1) pages.push(i);
        }
      } else {
        // Show pages 1, ..., currentPage-1, currentPage, currentPage+1, ..., totalPages
        pages.push("...");
        for (let i = currentPage - 1; i <= currentPage + 1; i++) {
          pages.push(i);
        }
        pages.push("...");
        pages.push(totalPages);
      }
    }

    return pages;
  };

  if (totalPages <= 1) {
    return (
      <div className="flex items-center justify-between px-4 py-3 bg-white border-t border-gray-200 sm:px-6">
        <div className="flex items-center text-sm text-gray-700">
          Showing {totalItems} {totalItems === 1 ? "result" : "results"}
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-between px-4 py-3 bg-white border-t border-gray-200 sm:px-6">
      {/* Results info */}
      <div className="flex items-center text-sm text-gray-700">
        Showing <span className="font-medium mx-1">{startItem}</span> to{" "}
        <span className="font-medium mx-1">{endItem}</span> of{" "}
        <span className="font-medium mx-1">{totalItems}</span> results
      </div>

      {/* Pagination controls */}
      <div className="flex items-center space-x-2">
        {/* Previous button */}
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className={`px-3 py-2 text-sm font-medium rounded-md ${
            currentPage === 1
              ? "text-gray-400 cursor-not-allowed bg-gray-100"
              : "text-gray-700 bg-white border border-gray-300 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
          }`}
        >
          Previous
        </button>

        {/* Page numbers */}
        <div className="flex items-center space-x-1">
          {getPageNumbers().map((page, index) => {
            if (page === "...") {
              return (
                <span
                  key={`ellipsis-${index}`}
                  className="px-3 py-2 text-sm text-gray-500"
                >
                  ...
                </span>
              );
            }

            return (
              <button
                key={page}
                onClick={() => onPageChange(page)}
                className={`px-3 py-2 text-sm font-medium rounded-md ${
                  currentPage === page
                    ? "text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    : "text-gray-700 bg-white border border-gray-300 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
                }`}
              >
                {page}
              </button>
            );
          })}
        </div>

        {/* Next button */}
        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className={`px-3 py-2 text-sm font-medium rounded-md ${
            currentPage === totalPages
              ? "text-gray-400 cursor-not-allowed bg-gray-100"
              : "text-gray-700 bg-white border border-gray-300 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
          }`}
        >
          Next
        </button>

        {/* Items per page selector */}
        <div className="flex items-center ml-4 space-x-2">
          <label className="text-sm text-gray-700">Show:</label>
          <select
            value={itemsPerPage}
            onChange={(e) => {
              // Reset to page 1 when changing items per page
              onPageChange(1, parseInt(e.target.value));
            }}
            className="text-sm border border-gray-300 rounded-md px-2 py-1 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value={5}>5</option>
            <option value={10}>10</option>
            <option value={20}>20</option>
            <option value={50}>50</option>
          </select>
          <span className="text-sm text-gray-700">per page</span>
        </div>
      </div>
    </div>
  );
}
