"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import CustomerList from "@/components/CustomerList";
import CustomerForm from "@/components/CustomerForm";
import CustomerFilters from "@/components/CustomerFilters";
import CustomerSearch from "@/components/CustomerSearch";
import Pagination from "@/components/Pagination";
import ExportCSV from "@/components/ExportCSV";
import { useAuth } from "@/contexts/AuthContext";

export default function Home() {
  const [customers, setCustomers] = useState([]);
  const [filteredCustomers, setFilteredCustomers] = useState([]);
  const [hasActiveFilters, setHasActiveFilters] = useState(false);
  const [searchResults, setSearchResults] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [editingCustomer, setEditingCustomer] = useState(null);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const router = useRouter();
  const { user, isAuthenticated, isLoading: authLoading, logout } = useAuth();

  // Get customers to display (search results take priority, then filtered, then all)
  const displayCustomers =
    searchResults !== null && Array.isArray(searchResults)
      ? searchResults
      : hasActiveFilters
      ? filteredCustomers
      : customers;

  // Calculate pagination
  const totalItems = displayCustomers.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedCustomers = displayCustomers.slice(startIndex, endIndex);

  // Handle page change
  const handlePageChange = (page, newItemsPerPage = itemsPerPage) => {
    if (newItemsPerPage !== itemsPerPage) {
      setItemsPerPage(newItemsPerPage);
      setCurrentPage(1);
    } else {
      setCurrentPage(page);
    }
  };

  // Reset to page 1 when filters change
  const handleFilteredCustomersChange = useCallback((filtered) => {
    setFilteredCustomers(filtered);
    setSearchResults(null); // Clear search when filtering
    setCurrentPage(1);
  }, []);

  // Handle active filters change
  const handleActiveFiltersChange = useCallback((hasActive) => {
    setHasActiveFilters(hasActive);
  }, []);

  // Handle search results
  const handleSearchResults = useCallback((results) => {
    setSearchResults(results);
    if (results !== null) {
      setFilteredCustomers([]); // Clear filters when searching
    }
    setCurrentPage(1);
  }, []);

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push("/auth/login");
    }
  }, [isAuthenticated, authLoading, router]);

  // Fetch customers
  const fetchCustomers = async () => {
    try {
      setIsLoading(true);
      const response = await fetch("/api/customers");
      const result = await response.json();

      if (result.success) {
        setCustomers(result.data);
      } else {
        setError("Failed to fetch customers");
      }
    } catch (error) {
      setError("Error connecting to server");
    } finally {
      setIsLoading(false);
    }
  };

  // Load customers on component mount
  useEffect(() => {
    fetchCustomers();
  }, []);

  // Clear messages after 5 seconds
  useEffect(() => {
    if (error || success) {
      const timer = setTimeout(() => {
        setError("");
        setSuccess("");
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [error, success]);

  // Handle form submission
  const handleSubmit = async (formData) => {
    setIsSubmitting(true);
    setError("");
    setSuccess("");

    try {
      const url = editingCustomer
        ? `/api/customers/${editingCustomer._id}`
        : "/api/customers";

      const method = editingCustomer ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const result = await response.json();

      if (result.success) {
        setSuccess(
          editingCustomer
            ? "Customer updated successfully!"
            : "Customer added successfully!"
        );
        setShowForm(false);
        setEditingCustomer(null);
        fetchCustomers(); // Refresh the list
      } else {
        setError(
          Array.isArray(result.error) ? result.error.join(", ") : result.error
        );
      }
    } catch (error) {
      setError("Error connecting to server");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle edit customer
  const handleEdit = (customer) => {
    setEditingCustomer(customer);
    setShowForm(true);
    setError("");
    setSuccess("");
  };

  // Handle delete customer
  const handleDelete = async (customerId) => {
    try {
      const response = await fetch(`/api/customers/${customerId}`, {
        method: "DELETE",
      });

      const result = await response.json();

      if (result.success) {
        setSuccess("Customer deleted successfully!");
        fetchCustomers(); // Refresh the list
      } else {
        setError("Failed to delete customer");
      }
    } catch (error) {
      setError("Error connecting to server");
    }
  };

  // Handle cancel form
  const handleCancel = () => {
    setShowForm(false);
    setEditingCustomer(null);
    setError("");
    setSuccess("");
  };

  // Handle add new customer
  const handleAddNew = () => {
    setEditingCustomer(null);
    setShowForm(true);
    setError("");
    setSuccess("");
  };

  const interestedCount = customers.filter((c) => c.interested).length;
  const totalCustomers = customers.length;

  // Show loading while auth is being checked
  if (authLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  // Don't render if not authenticated
  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center">
              <h1 className="text-2xl font-bold text-gray-900">
                KC Digital CRM
              </h1>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-600">
                Welcome, {user?.username}
              </span>
              <button
                onClick={logout}
                className="text-sm text-gray-500 hover:text-gray-700"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content - Left/Right Layout */}
      <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Sidebar - Form and Stats */}
          <div className="lg:col-span-1 space-y-6">
            {/* Stats Cards */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900">Overview</h3>
              <div className="grid grid-cols-1 gap-4">
                <div className="bg-white rounded-lg shadow-sm p-4 border">
                  <div className="text-2xl font-bold text-blue-600">
                    {totalCustomers}
                  </div>
                  <div className="text-gray-600 text-sm">Total Customers</div>
                </div>
                <div className="bg-white rounded-lg shadow-sm p-4 border">
                  <div className="text-2xl font-bold text-green-600">
                    {interestedCount}
                  </div>
                  <div className="text-gray-600 text-sm">Interested</div>
                </div>
                <div className="bg-white rounded-lg shadow-sm p-4 border">
                  <div className="text-2xl font-bold text-orange-600">
                    {totalCustomers > 0
                      ? Math.round((interestedCount / totalCustomers) * 100)
                      : 0}
                    %
                  </div>
                  <div className="text-gray-600 text-sm">Interest Rate</div>
                </div>
              </div>
            </div>

            {/* Add Customer Button */}
            <button
              onClick={handleAddNew}
              className="w-full bg-blue-600 text-white px-4 py-3 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 font-medium"
            >
              Add New Customer
            </button>

            {/* Form */}
            {showForm && (
              <div className="bg-white rounded-lg shadow-lg border p-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-6">
                  {editingCustomer ? "Edit Customer" : "Add New Customer"}
                </h3>
                <CustomerForm
                  customer={editingCustomer}
                  onSubmit={handleSubmit}
                  onCancel={handleCancel}
                  isLoading={isSubmitting}
                />
              </div>
            )}
          </div>

          {/* Right Content - Customer List */}
          <div className="lg:col-span-2 space-y-6">
            {/* Messages */}
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md">
                {error}
              </div>
            )}

            {success && (
              <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-md">
                {success}
              </div>
            )}

            {/* Customer List Header */}
            <div className="flex justify-between items-center">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">
                  Customer Management
                </h2>
                <p className="text-gray-600 mt-1">
                  Manage your digital marketing clients
                </p>
              </div>
              {/* Export CSV Button */}
              <div className="flex-shrink-0">
                <ExportCSV customers={customers} />
              </div>
            </div>

            {/* Customer Search */}
            <div>
              <CustomerSearch
                customers={customers}
                onSearchResults={handleSearchResults}
                totalCount={customers.length}
              />
            </div>

            {/* Customer Filters */}
            <div>
              <CustomerFilters
                customers={customers}
                onFilteredCustomersChange={handleFilteredCustomersChange}
                onActiveFiltersChange={handleActiveFiltersChange}
                totalCount={customers.length}
              />
            </div>

            {/* Customer List */}
            <div className="bg-white shadow-sm rounded-lg overflow-hidden">
              <CustomerList
                customers={paginatedCustomers}
                onEdit={handleEdit}
                onDelete={handleDelete}
                isLoading={isLoading}
              />

              {/* Pagination */}
              {!isLoading && totalItems > 0 && (
                <Pagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  totalItems={totalItems}
                  itemsPerPage={itemsPerPage}
                  onPageChange={handlePageChange}
                />
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
