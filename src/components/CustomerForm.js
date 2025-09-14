"use client";

import { useState } from "react";

const packages = [
  { value: "", label: "Select a package" },
  {
    value: "Starter Landing Page",
    label: "Starter Landing Page - $700",
    price: "$700",
  },
  {
    value: "Growth Landing Page",
    label: "Growth Landing Page - $1,500",
    price: "$1,500",
  },
  {
    value: "Pro Website",
    label: "Pro Website - from $3,500+",
    price: "from $3,500+",
  },
  { value: "Other", label: "Other", price: "" },
];

export default function CustomerForm({
  customer = null,
  onSubmit,
  onCancel,
  isLoading = false,
}) {
  const [formData, setFormData] = useState({
    name: customer?.name || "",
    businessName: customer?.businessName || "",
    phone: customer?.phone || "",
    email: customer?.email || "",
    interested: customer?.interested || false,
    package: customer?.package || "",
    packagePrice: customer?.packagePrice || "",
    notes: customer?.notes || "",
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    if (name === "package") {
      const selectedPackage = packages.find((pkg) => pkg.value === value);
      setFormData((prev) => ({
        ...prev,
        [name]: value,
        packagePrice: selectedPackage?.price || "",
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: type === "checkbox" ? checked : value,
      }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label
            htmlFor="name"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            Name *
          </label>
          <input
            type="text"
            id="name"
            name="name"
            required
            value={formData.name}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900"
            placeholder="Enter customer name"
          />
        </div>

        <div>
          <label
            htmlFor="businessName"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            Business Name *
          </label>
          <input
            type="text"
            id="businessName"
            name="businessName"
            required
            value={formData.businessName}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900"
            placeholder="Enter business name"
          />
        </div>

        <div>
          <label
            htmlFor="phone"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            Phone Number
          </label>
          <input
            type="tel"
            id="phone"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900"
            placeholder="Enter phone number"
          />
        </div>

        <div>
          <label
            htmlFor="email"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            Email Address
          </label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900"
            placeholder="Enter email address"
          />
        </div>
      </div>

      <div className="flex items-center">
        <input
          type="checkbox"
          id="interested"
          name="interested"
          checked={formData.interested}
          onChange={handleChange}
          className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
        />
        <label
          htmlFor="interested"
          className="ml-2 block text-sm text-gray-900"
        >
          Customer is interested
        </label>
      </div>

      <div>
        <label
          htmlFor="package"
          className="block text-sm font-medium text-gray-700 mb-2"
        >
          Package
        </label>
        <select
          id="package"
          name="package"
          value={formData.package}
          onChange={handleChange}
          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900"
        >
          {packages.map((pkg) => (
            <option key={pkg.value} value={pkg.value}>
              {pkg.label}
            </option>
          ))}
        </select>
      </div>

      {formData.package === "Other" && (
        <div>
          <label
            htmlFor="packagePrice"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            Custom Package Price
          </label>
          <input
            type="text"
            id="packagePrice"
            name="packagePrice"
            value={formData.packagePrice}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900"
            placeholder="Enter custom price"
          />
        </div>
      )}

      <div>
        <label
          htmlFor="notes"
          className="block text-sm font-medium text-gray-700 mb-2"
        >
          Notes
        </label>
        <textarea
          id="notes"
          name="notes"
          rows={4}
          value={formData.notes}
          onChange={handleChange}
          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900"
          placeholder="Enter any additional notes..."
        />
      </div>

      <div className="flex justify-end space-x-4">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={isLoading}
          className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading
            ? "Saving..."
            : customer
            ? "Update Customer"
            : "Add Customer"}
        </button>
      </div>
    </form>
  );
}
