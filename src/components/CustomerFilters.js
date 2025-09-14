"use client";

import { useState, useEffect } from "react";

export default function CustomerFilters({
  customers,
  onFilteredCustomersChange,
  totalCount,
}) {
  const [dateSort, setDateSort] = useState("newest"); // newest, oldest
  const [interestFilter, setInterestFilter] = useState("all"); // all, interested, not-interested
  const [packageFilter, setPackageFilter] = useState("all"); // all, starter, growth, pro, other, none

  // Apply filters and sorting
  const applyFiltersAndSort = (
    sortBy = dateSort,
    interestBy = interestFilter,
    packageBy = packageFilter
  ) => {
    let filtered = [...customers];

    // Filter by interest status
    if (interestBy === "interested") {
      filtered = filtered.filter((customer) => customer.interested);
    } else if (interestBy === "not-interested") {
      filtered = filtered.filter((customer) => !customer.interested);
    }

    // Filter by package
    if (packageBy !== "all") {
      if (packageBy === "none") {
        filtered = filtered.filter((customer) => !customer.package);
      } else if (packageBy === "starter") {
        filtered = filtered.filter(
          (customer) => customer.package === "Starter Landing Page"
        );
      } else if (packageBy === "growth") {
        filtered = filtered.filter(
          (customer) => customer.package === "Growth Landing Page"
        );
      } else if (packageBy === "pro") {
        filtered = filtered.filter(
          (customer) => customer.package === "Pro Website"
        );
      } else if (packageBy === "other") {
        filtered = filtered.filter((customer) => customer.package === "Other");
      }
    }

    // Sort by date
    if (sortBy === "newest") {
      filtered.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    } else if (sortBy === "oldest") {
      filtered.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
    }

    onFilteredCustomersChange(filtered);
  };

  const handleDateSortChange = (value) => {
    setDateSort(value);
    applyFiltersAndSort(value, interestFilter, packageFilter);
  };

  const handleInterestFilterChange = (value) => {
    setInterestFilter(value);
    applyFiltersAndSort(dateSort, value, packageFilter);
  };

  const handlePackageFilterChange = (value) => {
    setPackageFilter(value);
    applyFiltersAndSort(dateSort, interestFilter, value);
  };

  const clearAllFilters = () => {
    setDateSort("newest");
    setInterestFilter("all");
    setPackageFilter("all");
    applyFiltersAndSort("newest", "all", "all");
  };

  // Calculate filter counts
  const interestedCount = customers.filter((c) => c.interested).length;
  const notInterestedCount = customers.filter((c) => !c.interested).length;
  const starterCount = customers.filter(
    (c) => c.package === "Starter Landing Page"
  ).length;
  const growthCount = customers.filter(
    (c) => c.package === "Growth Landing Page"
  ).length;
  const proCount = customers.filter((c) => c.package === "Pro Website").length;
  const otherCount = customers.filter((c) => c.package === "Other").length;
  const noPackageCount = customers.filter((c) => !c.package).length;

  // Apply initial filter on component mount
  useEffect(() => {
    applyFiltersAndSort();
  }, [customers]);

  return (
    <div className="bg-white shadow-sm rounded-lg p-4 mb-6 border">
      <div className="flex flex-wrap items-center gap-4">
        {/* Date Sort */}
        <div className="flex items-center space-x-2">
          <label className="text-sm font-medium text-gray-700">
            Sort by Date:
          </label>
          <select
            value={dateSort}
            onChange={(e) => handleDateSortChange(e.target.value)}
            className="text-sm border border-gray-300 rounded-md px-2 py-1 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="newest">Newest First</option>
            <option value="oldest">Oldest First</option>
          </select>
        </div>

        {/* Interest Filter */}
        <div className="flex items-center space-x-2">
          <label className="text-sm font-medium text-gray-700">
            Interest Status:
          </label>
          <select
            value={interestFilter}
            onChange={(e) => handleInterestFilterChange(e.target.value)}
            className="text-sm border border-gray-300 rounded-md px-2 py-1 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">All ({totalCount})</option>
            <option value="interested">Interested ({interestedCount})</option>
            <option value="not-interested">
              Not Interested ({notInterestedCount})
            </option>
          </select>
        </div>

        {/* Package Filter */}
        <div className="flex items-center space-x-2">
          <label className="text-sm font-medium text-gray-700">Package:</label>
          <select
            value={packageFilter}
            onChange={(e) => handlePackageFilterChange(e.target.value)}
            className="text-sm border border-gray-300 rounded-md px-2 py-1 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">All Packages ({totalCount})</option>
            <option value="starter">
              Starter Landing Page ({starterCount})
            </option>
            <option value="growth">Growth Landing Page ({growthCount})</option>
            <option value="pro">Pro Website ({proCount})</option>
            <option value="other">Other ({otherCount})</option>
            <option value="none">No Package ({noPackageCount})</option>
          </select>
        </div>

        {/* Clear Filters Button */}
        <button
          onClick={clearAllFilters}
          className="text-sm px-3 py-1 text-gray-600 hover:text-gray-900 border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          Clear Filters
        </button>

        {/* Results Count */}
        <div className="text-sm text-gray-500 ml-auto">
          Showing {onFilteredCustomersChange ? "filtered" : totalCount} of{" "}
          {totalCount} customers
        </div>
      </div>

      {/* Active Filters Summary */}
      {(dateSort !== "newest" ||
        interestFilter !== "all" ||
        packageFilter !== "all") && (
        <div className="mt-3 pt-3 border-t border-gray-200">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs font-medium text-gray-500">
              Active filters:
            </span>

            {dateSort !== "newest" && (
              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                {dateSort === "oldest" ? "Oldest First" : "Newest First"}
              </span>
            )}

            {interestFilter !== "all" && (
              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                {interestFilter === "interested"
                  ? "Interested"
                  : "Not Interested"}
              </span>
            )}

            {packageFilter !== "all" && (
              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                {packageFilter === "starter" && "Starter Landing Page"}
                {packageFilter === "growth" && "Growth Landing Page"}
                {packageFilter === "pro" && "Pro Website"}
                {packageFilter === "other" && "Other"}
                {packageFilter === "none" && "No Package"}
              </span>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
