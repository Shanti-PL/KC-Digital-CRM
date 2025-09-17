"use client";

import { useState, useEffect, useCallback } from "react";

export default function CustomerFilters({
  customers,
  onFilteredCustomersChange,
  onActiveFiltersChange,
  totalCount,
}) {
  const [dateSort, setDateSort] = useState("newest"); // newest, oldest
  const [interestFilter, setInterestFilter] = useState("all"); // all, interested, not-interested
  const [packageFilter, setPackageFilter] = useState("all"); // all, starter, growth, pro, other, none
  const [projectStatusFilter, setProjectStatusFilter] = useState("all"); // all, not-start, designing, developing, reviewing, live
  const [dateRangeFilter, setDateRangeFilter] = useState("all"); // all, today, week, month, quarter, year, custom
  const [customStartDate, setCustomStartDate] = useState("");
  const [customEndDate, setCustomEndDate] = useState("");

  // Apply filters and sorting
  const applyFiltersAndSort = useCallback(
    (
      sortBy = dateSort,
      interestBy = interestFilter,
      packageBy = packageFilter,
      projectStatusBy = projectStatusFilter,
      dateRangeBy = dateRangeFilter,
      startDate = customStartDate,
      endDate = customEndDate
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
          filtered = filtered.filter(
            (customer) => customer.package === "Other"
          );
        }
      }

      // Filter by project status
      if (projectStatusBy !== "all") {
        if (projectStatusBy === "not-set") {
          filtered = filtered.filter((customer) => !customer.projectStatus);
        } else {
          filtered = filtered.filter(
            (customer) =>
              customer.projectStatus === projectStatusBy.replace("-", " ")
          );
        }
      }

      // Filter by date range
      if (dateRangeBy !== "all") {
        const now = new Date();
        let filterStartDate, filterEndDate;

        switch (dateRangeBy) {
          case "today":
            filterStartDate = new Date(
              now.getFullYear(),
              now.getMonth(),
              now.getDate()
            );
            filterEndDate = new Date(
              now.getFullYear(),
              now.getMonth(),
              now.getDate() + 1
            );
            break;
          case "week":
            const weekStart = new Date(now);
            weekStart.setDate(now.getDate() - now.getDay()); // Start of week (Sunday)
            weekStart.setHours(0, 0, 0, 0);
            filterStartDate = weekStart;
            filterEndDate = new Date(
              weekStart.getTime() + 7 * 24 * 60 * 60 * 1000
            );
            break;
          case "month":
            filterStartDate = new Date(now.getFullYear(), now.getMonth(), 1);
            filterEndDate = new Date(now.getFullYear(), now.getMonth() + 1, 1);
            break;
          case "quarter":
            const quarter = Math.floor(now.getMonth() / 3);
            filterStartDate = new Date(now.getFullYear(), quarter * 3, 1);
            filterEndDate = new Date(now.getFullYear(), (quarter + 1) * 3, 1);
            break;
          case "year":
            filterStartDate = new Date(now.getFullYear(), 0, 1);
            filterEndDate = new Date(now.getFullYear() + 1, 0, 1);
            break;
          case "custom":
            if (startDate && endDate) {
              filterStartDate = new Date(startDate);
              filterEndDate = new Date(endDate);
              filterEndDate.setHours(23, 59, 59, 999); // Include the entire end date
            }
            break;
        }

        if (filterStartDate && filterEndDate) {
          filtered = filtered.filter((customer) => {
            const customerDate = new Date(customer.createdAt);
            return (
              customerDate >= filterStartDate && customerDate < filterEndDate
            );
          });
        }
      }

      // Sort by date
      if (sortBy === "newest") {
        filtered.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      } else if (sortBy === "oldest") {
        filtered.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
      }

      onFilteredCustomersChange(filtered);

      // Check if any filters are active
      const hasActiveFilters =
        sortBy !== "newest" ||
        interestBy !== "all" ||
        packageBy !== "all" ||
        projectStatusBy !== "all" ||
        dateRangeBy !== "all";

      if (onActiveFiltersChange) {
        onActiveFiltersChange(hasActiveFilters);
      }
    },
    [
      customers,
      onFilteredCustomersChange,
      onActiveFiltersChange,
      dateSort,
      interestFilter,
      packageFilter,
      projectStatusFilter,
      dateRangeFilter,
      customStartDate,
      customEndDate,
    ]
  );

  const handleDateSortChange = (value) => {
    setDateSort(value);
    applyFiltersAndSort(
      value,
      interestFilter,
      packageFilter,
      projectStatusFilter,
      dateRangeFilter,
      customStartDate,
      customEndDate
    );
  };

  const handleInterestFilterChange = (value) => {
    setInterestFilter(value);
    applyFiltersAndSort(
      dateSort,
      value,
      packageFilter,
      projectStatusFilter,
      dateRangeFilter,
      customStartDate,
      customEndDate
    );
  };

  const handlePackageFilterChange = (value) => {
    setPackageFilter(value);
    applyFiltersAndSort(
      dateSort,
      interestFilter,
      value,
      projectStatusFilter,
      dateRangeFilter,
      customStartDate,
      customEndDate
    );
  };

  const handleProjectStatusFilterChange = (value) => {
    setProjectStatusFilter(value);
    applyFiltersAndSort(
      dateSort,
      interestFilter,
      packageFilter,
      value,
      dateRangeFilter,
      customStartDate,
      customEndDate
    );
  };

  const handleDateRangeFilterChange = (value) => {
    setDateRangeFilter(value);
    applyFiltersAndSort(
      dateSort,
      interestFilter,
      packageFilter,
      projectStatusFilter,
      value,
      customStartDate,
      customEndDate
    );
  };

  const handleCustomDateChange = (startDate, endDate) => {
    setCustomStartDate(startDate);
    setCustomEndDate(endDate);
    if (dateRangeFilter === "custom") {
      applyFiltersAndSort(
        dateSort,
        interestFilter,
        packageFilter,
        projectStatusFilter,
        "custom",
        startDate,
        endDate
      );
    }
  };

  const clearAllFilters = () => {
    setDateSort("newest");
    setInterestFilter("all");
    setPackageFilter("all");
    setProjectStatusFilter("all");
    setDateRangeFilter("all");
    setCustomStartDate("");
    setCustomEndDate("");
    applyFiltersAndSort("newest", "all", "all", "all", "all", "", "");
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

  // Calculate project status counts
  const notStartCount = customers.filter(
    (c) => c.projectStatus === "not start"
  ).length;
  const designingCount = customers.filter(
    (c) => c.projectStatus === "designing"
  ).length;
  const developingCount = customers.filter(
    (c) => c.projectStatus === "developing"
  ).length;
  const reviewingCount = customers.filter(
    (c) => c.projectStatus === "reviewing"
  ).length;
  const liveCount = customers.filter((c) => c.projectStatus === "live").length;
  const noProjectStatusCount = customers.filter((c) => !c.projectStatus).length;

  // Apply initial filter on component mount
  useEffect(() => {
    applyFiltersAndSort();
  }, [applyFiltersAndSort]);

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

        {/* Project Status Filter */}
        <div className="flex items-center space-x-2">
          <label className="text-sm font-medium text-gray-700">
            Project Status:
          </label>
          <select
            value={projectStatusFilter}
            onChange={(e) => handleProjectStatusFilterChange(e.target.value)}
            className="text-sm border border-gray-300 rounded-md px-2 py-1 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">All Status ({totalCount})</option>
            <option value="not-start">Not Start ({notStartCount})</option>
            <option value="designing">Designing ({designingCount})</option>
            <option value="developing">Developing ({developingCount})</option>
            <option value="reviewing">Reviewing ({reviewingCount})</option>
            <option value="live">Live ({liveCount})</option>
            <option value="not-set">Not Set ({noProjectStatusCount})</option>
          </select>
        </div>

        {/* Date Range Filter */}
        <div className="flex items-center space-x-2">
          <label className="text-sm font-medium text-gray-700">
            Date Range:
          </label>
          <select
            value={dateRangeFilter}
            onChange={(e) => handleDateRangeFilterChange(e.target.value)}
            className="text-sm border border-gray-300 rounded-md px-2 py-1 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">All Time</option>
            <option value="today">Today</option>
            <option value="week">This Week</option>
            <option value="month">This Month</option>
            <option value="quarter">This Quarter</option>
            <option value="year">This Year</option>
            <option value="custom">Custom Range</option>
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

      {/* Custom Date Range Inputs */}
      {dateRangeFilter === "custom" && (
        <div className="mt-4 pt-4 border-t border-gray-200">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <label className="text-sm font-medium text-gray-700">From:</label>
              <input
                type="date"
                value={customStartDate}
                onChange={(e) =>
                  handleCustomDateChange(e.target.value, customEndDate)
                }
                className="text-sm border border-gray-300 rounded-md px-2 py-1 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div className="flex items-center space-x-2">
              <label className="text-sm font-medium text-gray-700">To:</label>
              <input
                type="date"
                value={customEndDate}
                onChange={(e) =>
                  handleCustomDateChange(customStartDate, e.target.value)
                }
                className="text-sm border border-gray-300 rounded-md px-2 py-1 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            {customStartDate && customEndDate && (
              <div className="text-sm text-gray-600">
                {new Date(customEndDate) - new Date(customStartDate) >= 0
                  ? `${
                      Math.ceil(
                        (new Date(customEndDate) - new Date(customStartDate)) /
                          (1000 * 60 * 60 * 24)
                      ) + 1
                    } days`
                  : "Invalid range"}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Active Filters Summary */}
      {(dateSort !== "newest" ||
        interestFilter !== "all" ||
        packageFilter !== "all" ||
        projectStatusFilter !== "all" ||
        dateRangeFilter !== "all") && (
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

            {projectStatusFilter !== "all" && (
              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-orange-100 text-orange-800">
                {projectStatusFilter === "not-start" && "Not Start"}
                {projectStatusFilter === "designing" && "Designing"}
                {projectStatusFilter === "developing" && "Developing"}
                {projectStatusFilter === "reviewing" && "Reviewing"}
                {projectStatusFilter === "live" && "Live"}
                {projectStatusFilter === "not-set" && "Not Set"}
              </span>
            )}

            {dateRangeFilter !== "all" && (
              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800">
                {dateRangeFilter === "today" && "Today"}
                {dateRangeFilter === "week" && "This Week"}
                {dateRangeFilter === "month" && "This Month"}
                {dateRangeFilter === "quarter" && "This Quarter"}
                {dateRangeFilter === "year" && "This Year"}
                {dateRangeFilter === "custom" &&
                  customStartDate &&
                  customEndDate &&
                  `${customStartDate} to ${customEndDate}`}
                {dateRangeFilter === "custom" &&
                  (!customStartDate || !customEndDate) &&
                  "Custom Range"}
              </span>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
