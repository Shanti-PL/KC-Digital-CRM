"use client";

import { useState } from "react";
import CallRecords from "./CallRecords";
import CustomerDetailsModal from "./CustomerDetailsModal";

export default function CustomerList({
  customers,
  onEdit,
  onDelete,
  isLoading = false,
}) {
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [showCallRecords, setShowCallRecords] = useState(null);
  const [expandedNotes, setExpandedNotes] = useState(null);
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleDelete = async (id) => {
    if (deleteConfirm === id) {
      await onDelete(id);
      setDeleteConfirm(null);
    } else {
      setDeleteConfirm(id);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const openCustomerDetails = (customer) => {
    setSelectedCustomer(customer);
    setIsModalOpen(true);
  };

  const closeCustomerDetails = () => {
    setSelectedCustomer(null);
    setIsModalOpen(false);
  };

  const getPackageDisplay = (customer) => {
    if (!customer.package) return "No package selected";
    if (customer.package === "Other" && customer.packagePrice) {
      return `Other - ${customer.packagePrice}`;
    }
    return customer.package;
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (customers.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="text-gray-500 text-lg">No customers found</div>
        <p className="text-gray-400 mt-2">
          Add your first customer to get started
        </p>
      </div>
    );
  }

  return (
    <div>
      <div className="overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Customer
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Business
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Contact
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Notes
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Package
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Project Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Payment
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date Added
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {customers.map((customer) => (
                <tr
                  key={customer._id}
                  className="hover:bg-gray-50 cursor-pointer"
                  onClick={() => openCustomerDetails(customer)}
                >
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">
                      {customer.name}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {customer.businessName}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <div className="space-y-1">
                      {customer.phone && (
                        <div className="flex items-center">
                          <span className="text-xs">📞</span>
                          <span className="ml-1">{customer.phone}</span>
                        </div>
                      )}
                      {customer.email && (
                        <div className="flex items-center">
                          <span className="text-xs">✉️</span>
                          <span
                            className="ml-1 truncate max-w-xs"
                            title={customer.email}
                          >
                            {customer.email}
                          </span>
                        </div>
                      )}
                      {!customer.phone && !customer.email && (
                        <span className="text-gray-400">No contact info</span>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">
                    {customer.notes ? (
                      <div className="max-w-xs">
                        {expandedNotes === customer._id ? (
                          <div>
                            <div className="whitespace-pre-wrap break-words">
                              {customer.notes}
                            </div>
                            <button
                              onClick={() => setExpandedNotes(null)}
                              className="text-blue-600 hover:text-blue-800 text-xs mt-1"
                            >
                              Show less
                            </button>
                          </div>
                        ) : (
                          <div>
                            <div
                              className="break-words"
                              style={{
                                display: "-webkit-box",
                                WebkitLineClamp: 2,
                                WebkitBoxOrient: "vertical",
                                overflow: "hidden",
                              }}
                              title={customer.notes}
                            >
                              {customer.notes}
                            </div>
                            {customer.notes.length > 100 && (
                              <button
                                onClick={() => setExpandedNotes(customer._id)}
                                className="text-blue-600 hover:text-blue-800 text-xs mt-1"
                              >
                                Show more
                              </button>
                            )}
                          </div>
                        )}
                      </div>
                    ) : (
                      <span className="text-gray-400 italic">No notes</span>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                        customer.interested
                          ? "bg-green-100 text-green-800"
                          : "bg-gray-100 text-gray-800"
                      }`}
                    >
                      {customer.interested ? "Interested" : "Not Interested"}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {getPackageDisplay(customer)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                        customer.projectStatus === "live"
                          ? "bg-green-100 text-green-800"
                          : customer.projectStatus === "developing"
                          ? "bg-blue-100 text-blue-800"
                          : customer.projectStatus === "designing"
                          ? "bg-purple-100 text-purple-800"
                          : customer.projectStatus === "reviewing"
                          ? "bg-yellow-100 text-yellow-800"
                          : customer.projectStatus === "not start"
                          ? "bg-gray-100 text-gray-800"
                          : "bg-gray-50 text-gray-500"
                      }`}
                    >
                      {customer.projectStatus || "Not Set"}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    <div className="space-y-1">
                      <div className="flex items-center space-x-2">
                        <span className="text-xs font-medium text-gray-500">
                          Deposit:
                        </span>
                        <span
                          className={`inline-flex px-1.5 py-0.5 text-xs font-medium rounded ${
                            customer.depositStatus === "yes"
                              ? "bg-green-100 text-green-700"
                              : customer.depositStatus === "no"
                              ? "bg-red-100 text-red-700"
                              : "bg-gray-100 text-gray-500"
                          }`}
                        >
                          {customer.depositStatus || "N/A"}
                        </span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <span className="text-xs font-medium text-gray-500">
                          Paid:
                        </span>
                        <span
                          className={`inline-flex px-1.5 py-0.5 text-xs font-medium rounded ${
                            customer.projectPaid === "yes"
                              ? "bg-green-100 text-green-700"
                              : customer.projectPaid === "no"
                              ? "bg-red-100 text-red-700"
                              : "bg-gray-100 text-gray-500"
                          }`}
                        >
                          {customer.projectPaid || "N/A"}
                        </span>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {formatDate(customer.createdAt)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-left text-sm font-medium">
                    <div className="flex justify-start space-x-2">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setShowCallRecords(
                            showCallRecords === customer._id
                              ? null
                              : customer._id
                          );
                        }}
                        className="text-green-600 hover:text-green-900 px-2 py-1 rounded hover:bg-green-50"
                      >
                        {showCallRecords === customer._id
                          ? "Hide Calls"
                          : "Calls"}
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onEdit(customer);
                        }}
                        className="text-blue-600 hover:text-blue-900 px-2 py-1 rounded hover:bg-blue-50"
                      >
                        Edit
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDelete(customer._id);
                        }}
                        className={`px-2 py-1 rounded ${
                          deleteConfirm === customer._id
                            ? "text-white bg-red-600 hover:bg-red-700"
                            : "text-red-600 hover:text-red-900 hover:bg-red-50"
                        }`}
                      >
                        {deleteConfirm === customer._id ? "Confirm" : "Delete"}
                      </button>
                      {deleteConfirm === customer._id && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setDeleteConfirm(null);
                          }}
                          className="text-gray-600 hover:text-gray-900 px-2 py-1 rounded hover:bg-gray-50"
                        >
                          Cancel
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Call Records Component */}
      {showCallRecords && (
        <CallRecords customerId={showCallRecords} isVisible={true} />
      )}

      {/* Customer Details Modal */}
      <CustomerDetailsModal
        customer={selectedCustomer}
        isOpen={isModalOpen}
        onClose={closeCustomerDetails}
      />
    </div>
  );
}
