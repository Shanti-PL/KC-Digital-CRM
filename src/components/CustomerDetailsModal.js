"use client";

import { useState, useEffect } from "react";
import CallRecords from "./CallRecords";

export default function CustomerDetailsModal({ customer, isOpen, onClose }) {
  const [showFullNotes, setShowFullNotes] = useState(false);

  // Close modal with Escape key
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === "Escape") {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener("keydown", handleEscape);
      // Prevent body scroll when modal is open
      document.body.style.overflow = "hidden";
    }

    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.body.style.overflow = "unset";
    };
  }, [isOpen, onClose]);

  if (!isOpen || !customer) return null;

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getPackageDisplay = (customer) => {
    if (!customer.package) return "No package selected";
    if (customer.package === "Other") {
      return customer.packagePrice
        ? `Other - ${customer.packagePrice}`
        : "Other";
    }
    return customer.package;
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black bg-opacity-50 transition-opacity"
        onClick={onClose}
      ></div>

      {/* Modal */}
      <div className="flex min-h-full items-center justify-center p-4">
        <div className="relative bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
          {/* Header */}
          <div className="bg-blue-600 px-6 py-4 flex justify-between items-center">
            <h2 className="text-xl font-semibold text-white">
              Customer Details
            </h2>
            <button
              onClick={onClose}
              className="text-white hover:text-gray-200 text-2xl font-bold"
            >
              ×
            </button>
          </div>

          {/* Content */}
          <div className="p-6 overflow-y-auto max-h-[calc(90vh-80px)]">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Basic Information */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900 border-b pb-2">
                  Basic Information
                </h3>

                <div className="space-y-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Customer Name
                    </label>
                    <p className="mt-1 text-sm text-gray-900 bg-gray-50 p-2 rounded">
                      {customer.name}
                    </p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Business Name
                    </label>
                    <p className="mt-1 text-sm text-gray-900 bg-gray-50 p-2 rounded">
                      {customer.businessName}
                    </p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Interest Status
                    </label>
                    <span
                      className={`inline-flex mt-1 px-3 py-1 text-sm font-semibold rounded-full ${
                        customer.interested
                          ? "bg-green-100 text-green-800"
                          : "bg-gray-100 text-gray-800"
                      }`}
                    >
                      {customer.interested ? "Interested" : "Not Interested"}
                    </span>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Package
                    </label>
                    <p className="mt-1 text-sm text-gray-900 bg-gray-50 p-2 rounded">
                      {getPackageDisplay(customer)}
                    </p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Project Status
                    </label>
                    <span
                      className={`inline-flex mt-1 px-3 py-1 text-sm font-semibold rounded-full ${
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
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Date Added
                    </label>
                    <p className="mt-1 text-sm text-gray-900 bg-gray-50 p-2 rounded">
                      {formatDate(customer.createdAt)}
                    </p>
                  </div>

                  {customer.updatedAt &&
                    customer.updatedAt !== customer.createdAt && (
                      <div>
                        <label className="block text-sm font-medium text-gray-700">
                          Last Updated
                        </label>
                        <p className="mt-1 text-sm text-gray-900 bg-gray-50 p-2 rounded">
                          {formatDate(customer.updatedAt)}
                        </p>
                      </div>
                    )}
                </div>
              </div>

              {/* Contact & Payment Information */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900 border-b pb-2">
                  Contact & Payment Information
                </h3>

                <div className="space-y-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Phone Number
                    </label>
                    <p className="mt-1 text-sm text-gray-900 bg-gray-50 p-2 rounded">
                      {customer.phone ? (
                        <span className="flex items-center">
                          📞 <span className="ml-2">{customer.phone}</span>
                        </span>
                      ) : (
                        <span className="text-gray-400 italic">
                          No phone number
                        </span>
                      )}
                    </p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Email Address
                    </label>
                    <p className="mt-1 text-sm text-gray-900 bg-gray-50 p-2 rounded">
                      {customer.email ? (
                        <span className="flex items-center">
                          ✉️ <span className="ml-2">{customer.email}</span>
                        </span>
                      ) : (
                        <span className="text-gray-400 italic">
                          No email address
                        </span>
                      )}
                    </p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Deposit Status
                    </label>
                    <span
                      className={`inline-flex mt-1 px-3 py-1 text-sm font-semibold rounded-full ${
                        customer.depositStatus === "yes"
                          ? "bg-green-100 text-green-800"
                          : customer.depositStatus === "no"
                          ? "bg-red-100 text-red-800"
                          : "bg-gray-100 text-gray-800"
                      }`}
                    >
                      {customer.depositStatus === "yes"
                        ? "Deposit Received"
                        : customer.depositStatus === "no"
                        ? "Deposit Pending"
                        : "Not Set"}
                    </span>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Project Paid
                    </label>
                    <span
                      className={`inline-flex mt-1 px-3 py-1 text-sm font-semibold rounded-full ${
                        customer.projectPaid === "yes"
                          ? "bg-green-100 text-green-800"
                          : customer.projectPaid === "no"
                          ? "bg-red-100 text-red-800"
                          : "bg-gray-100 text-gray-800"
                      }`}
                    >
                      {customer.projectPaid === "yes"
                        ? "Fully Paid"
                        : customer.projectPaid === "no"
                        ? "Payment Pending"
                        : "Not Set"}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Notes Section - Full Width */}
            <div className="mt-6">
              <h3 className="text-lg font-semibold text-gray-900 border-b pb-2 mb-4">
                Notes
              </h3>

              {customer.notes ? (
                <div className="bg-gray-50 p-4 rounded-lg">
                  <div className="text-sm text-gray-900 whitespace-pre-wrap break-words leading-relaxed">
                    {customer.notes}
                  </div>
                  <div className="mt-2 text-xs text-gray-500">
                    {customer.notes.length} characters
                  </div>
                </div>
              ) : (
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-gray-400 italic text-sm">
                    No notes available
                  </p>
                </div>
              )}
            </div>

            {/* Call Records */}
            <div className="mt-6">
              <h3 className="text-lg font-semibold text-gray-900 border-b pb-2 mb-4">
                Call Records
              </h3>
              <CallRecords customerId={customer._id} isVisible={true} />
            </div>
          </div>

          {/* Footer */}
          <div className="bg-gray-50 px-6 py-4 flex justify-end">
            <button
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
