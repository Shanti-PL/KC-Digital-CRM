"use client";

import { useState } from "react";

export default function ExportCSV({ customers }) {
  const [isExporting, setIsExporting] = useState(false);

  const formatDate = (dateString) => {
    if (!dateString) return "";
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    });
  };

  const formatCallRecords = (callRecords) => {
    if (!callRecords || callRecords.length === 0) return "";

    return callRecords
      .map((record) => {
        const date = formatDate(record.date);
        const notes = record.notes?.replace(/"/g, '""') || ""; // Escape quotes for CSV
        return `${date}: ${notes}`;
      })
      .join(" | ");
  };

  const escapeCSVField = (field) => {
    if (field === null || field === undefined) return "";
    const stringField = String(field);

    // If field contains comma, newline, or quotes, wrap in quotes and escape internal quotes
    if (
      stringField.includes(",") ||
      stringField.includes("\n") ||
      stringField.includes('"')
    ) {
      return `"${stringField.replace(/"/g, '""')}"`;
    }
    return stringField;
  };

  const exportToCSV = async () => {
    setIsExporting(true);

    try {
      // Define CSV headers
      const headers = [
        "Name",
        "Business Name",
        "Phone",
        "Email",
        "Interested",
        "Package",
        "Package Price",
        "Notes",
        "Call Records",
        "Created Date",
        "Updated Date",
      ];

      // Convert customers data to CSV rows
      const csvRows = customers.map((customer) => [
        escapeCSVField(customer.name),
        escapeCSVField(customer.businessName),
        escapeCSVField(customer.phone),
        escapeCSVField(customer.email),
        escapeCSVField(customer.interested ? "Yes" : "No"),
        escapeCSVField(customer.package),
        escapeCSVField(customer.packagePrice),
        escapeCSVField(customer.notes),
        escapeCSVField(formatCallRecords(customer.callRecords)),
        escapeCSVField(formatDate(customer.createdAt)),
        escapeCSVField(formatDate(customer.updatedAt)),
      ]);

      // Combine headers and rows
      const csvContent = [
        headers.join(","),
        ...csvRows.map((row) => row.join(",")),
      ].join("\n");

      // Create and download the file
      const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
      const link = document.createElement("a");

      if (link.download !== undefined) {
        const url = URL.createObjectURL(blob);
        link.setAttribute("href", url);

        // Generate filename with current date
        const today = new Date();
        const dateString = today.toISOString().split("T")[0]; // YYYY-MM-DD format
        link.setAttribute("download", `KC-Digital-CRM-${dateString}.csv`);

        link.style.visibility = "hidden";
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
      }
    } catch (error) {
      console.error("Error exporting CSV:", error);
      alert("Error exporting CSV file. Please try again.");
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <button
      onClick={exportToCSV}
      disabled={isExporting || customers.length === 0}
      className={`
        inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white
        ${
          isExporting || customers.length === 0
            ? "bg-gray-400 cursor-not-allowed"
            : "bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
        }
        transition-colors duration-200
      `}
    >
      <svg
        className={`-ml-1 mr-2 h-4 w-4 ${isExporting ? "animate-spin" : ""}`}
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        {isExporting ? (
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
          />
        ) : (
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
          />
        )}
      </svg>
      {isExporting
        ? "Exporting..."
        : `Export CSV (${customers.length} customers)`}
    </button>
  );
}
