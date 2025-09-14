"use client";

import { useState, useEffect } from "react";

export default function CustomerSearch({
  customers,
  onSearchResults,
  totalCount,
}) {
  const [searchTerm, setSearchTerm] = useState("");
  const [isSearching, setIsSearching] = useState(false);

  // Perform search
  const performSearch = (term) => {
    if (!term || term.trim() === "") {
      onSearchResults(null); // Pass null to indicate no search
      return;
    }

    setIsSearching(true);
    const searchLower = term.toLowerCase().trim();

    const results = customers.filter((customer) => {
      // Search in basic information
      const nameMatch = customer.name?.toLowerCase().includes(searchLower);
      const businessMatch = customer.businessName
        ?.toLowerCase()
        .includes(searchLower);
      const notesMatch = customer.notes?.toLowerCase().includes(searchLower);

      // Search in contact information
      const phoneMatch = customer.phone?.toLowerCase().includes(searchLower);
      const emailMatch = customer.email?.toLowerCase().includes(searchLower);

      // Search in package information
      const packageMatch = customer.package
        ?.toLowerCase()
        .includes(searchLower);
      const packagePriceMatch = customer.packagePrice
        ?.toLowerCase()
        .includes(searchLower);

      // Search in interest status
      const interestMatch = customer.interested
        ? "interested".includes(searchLower) || "yes".includes(searchLower)
        : "not interested".includes(searchLower) || "no".includes(searchLower);

      // Search in call records
      const callRecordsMatch = customer.callRecords?.some((record) =>
        record.notes?.toLowerCase().includes(searchLower)
      );

      return (
        nameMatch ||
        businessMatch ||
        notesMatch ||
        phoneMatch ||
        emailMatch ||
        packageMatch ||
        packagePriceMatch ||
        interestMatch ||
        callRecordsMatch
      );
    });

    onSearchResults(results);
    setIsSearching(false);
  };

  // Debounce search to avoid too many calls
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      performSearch(searchTerm);
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [searchTerm, customers]);

  const handleClearSearch = () => {
    setSearchTerm("");
    onSearchResults(null); // Pass null to indicate no search
  };

  const getSearchResultsCount = () => {
    if (!searchTerm.trim()) return totalCount;
    return customers.filter((customer) => {
      const searchLower = searchTerm.toLowerCase().trim();
      const nameMatch = customer.name?.toLowerCase().includes(searchLower);
      const businessMatch = customer.businessName
        ?.toLowerCase()
        .includes(searchLower);
      const notesMatch = customer.notes?.toLowerCase().includes(searchLower);
      const phoneMatch = customer.phone?.toLowerCase().includes(searchLower);
      const emailMatch = customer.email?.toLowerCase().includes(searchLower);
      const packageMatch = customer.package
        ?.toLowerCase()
        .includes(searchLower);
      const packagePriceMatch = customer.packagePrice
        ?.toLowerCase()
        .includes(searchLower);
      const interestMatch = customer.interested
        ? "interested".includes(searchLower) || "yes".includes(searchLower)
        : "not interested".includes(searchLower) || "no".includes(searchLower);
      const callRecordsMatch = customer.callRecords?.some((record) =>
        record.notes?.toLowerCase().includes(searchLower)
      );

      return (
        nameMatch ||
        businessMatch ||
        notesMatch ||
        phoneMatch ||
        emailMatch ||
        packageMatch ||
        packagePriceMatch ||
        interestMatch ||
        callRecordsMatch
      );
    }).length;
  };

  return (
    <div className="bg-white shadow-sm rounded-lg p-4 mb-4 border">
      <div className="flex items-center space-x-4">
        {/* Search Input */}
        <div className="flex-1 relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <svg
              className="h-5 w-5 text-gray-400"
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
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search customers by name, business, email, phone, notes, package, or call records..."
            className="block w-full pl-10 pr-10 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
          {searchTerm && (
            <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
              <button
                onClick={handleClearSearch}
                className="text-gray-400 hover:text-gray-600 focus:outline-none"
              >
                <svg
                  className="h-5 w-5"
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
            </div>
          )}
        </div>

        {/* Search Results Info */}
        <div className="text-sm text-gray-600 whitespace-nowrap">
          {isSearching ? (
            <div className="flex items-center">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600 mr-2"></div>
              Searching...
            </div>
          ) : searchTerm.trim() ? (
            <div>
              <span className="font-medium">{getSearchResultsCount()}</span> of{" "}
              <span className="font-medium">{totalCount}</span> customers
            </div>
          ) : (
            <div>
              <span className="font-medium">{totalCount}</span> total customers
            </div>
          )}
        </div>
      </div>

      {/* Search Tips */}
      {searchTerm.trim() && (
        <div className="mt-3 pt-3 border-t border-gray-200">
          <div className="text-xs text-gray-500">
            <span className="font-medium">Search includes:</span> Customer name,
            business name, contact info (phone & email), package details,
            interest status, notes, and call records
          </div>
        </div>
      )}

      {/* Active Search Indicator */}
      {searchTerm.trim() && (
        <div className="mt-2">
          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
            <svg
              className="h-3 w-3 mr-1"
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
            Searching: "{searchTerm}"
            <button
              onClick={handleClearSearch}
              className="ml-1 text-blue-600 hover:text-blue-800"
            >
              ×
            </button>
          </span>
        </div>
      )}
    </div>
  );
}
