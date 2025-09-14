"use client";

import { useState, useEffect, useCallback } from "react";

export default function CallRecords({ customerId, isVisible = false }) {
  const [callRecords, setCallRecords] = useState([]);
  const [newCallNote, setNewCallNote] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [editingCall, setEditingCall] = useState(null);
  const [editNote, setEditNote] = useState("");
  const [deleteConfirm, setDeleteConfirm] = useState(null);

  // Fetch call records
  const fetchCallRecords = useCallback(async () => {
    if (!customerId) return;

    try {
      setIsLoading(true);
      const response = await fetch(`/api/customers/${customerId}/calls`);
      const result = await response.json();

      if (result.success) {
        setCallRecords(result.data);
      } else {
        setError("Failed to fetch call records");
      }
    } catch (error) {
      setError("Error connecting to server");
    } finally {
      setIsLoading(false);
    }
  }, [customerId]);

  // Load call records when component becomes visible
  useEffect(() => {
    if (isVisible && customerId) {
      fetchCallRecords();
    }
  }, [isVisible, customerId, fetchCallRecords]);

  // Add new call record
  const handleAddCall = async (e) => {
    e.preventDefault();
    if (!newCallNote.trim()) return;

    try {
      setIsSubmitting(true);
      setError("");

      const response = await fetch(`/api/customers/${customerId}/calls`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ notes: newCallNote }),
      });

      const result = await response.json();

      if (result.success) {
        setNewCallNote("");
        fetchCallRecords(); // Refresh the list
      } else {
        setError(result.error || "Failed to add call record");
      }
    } catch (error) {
      setError("Error connecting to server");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Edit call record
  const handleEditCall = (call) => {
    setEditingCall(call._id);
    setEditNote(call.notes);
    setError("");
  };

  // Update call record
  const handleUpdateCall = async (callId) => {
    if (!editNote.trim()) return;

    try {
      setIsSubmitting(true);
      setError("");

      const response = await fetch(
        `/api/customers/${customerId}/calls/${callId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ notes: editNote }),
        }
      );

      const result = await response.json();

      if (result.success) {
        setEditingCall(null);
        setEditNote("");
        fetchCallRecords(); // Refresh the list
      } else {
        setError(result.error || "Failed to update call record");
      }
    } catch (error) {
      setError("Error connecting to server");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Delete call record
  const handleDeleteCall = async (callId) => {
    if (deleteConfirm !== callId) {
      setDeleteConfirm(callId);
      return;
    }

    try {
      setIsSubmitting(true);
      setError("");

      const response = await fetch(
        `/api/customers/${customerId}/calls/${callId}`,
        {
          method: "DELETE",
        }
      );

      const result = await response.json();

      if (result.success) {
        setDeleteConfirm(null);
        fetchCallRecords(); // Refresh the list
      } else {
        setError(result.error || "Failed to delete call record");
      }
    } catch (error) {
      setError("Error connecting to server");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Cancel edit
  const handleCancelEdit = () => {
    setEditingCall(null);
    setEditNote("");
    setDeleteConfirm(null);
    setError("");
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (!isVisible) return null;

  return (
    <div className="bg-white rounded-lg shadow-lg border p-6 mt-6">
      <h3 className="text-xl font-semibold text-gray-900 mb-4">Call Records</h3>

      {/* Add new call form */}
      <form onSubmit={handleAddCall} className="mb-6">
        <div className="space-y-3">
          <label className="block text-sm font-medium text-gray-700">
            Add New Call Record
          </label>
          <div className="flex gap-3">
            <textarea
              value={newCallNote}
              onChange={(e) => setNewCallNote(e.target.value)}
              placeholder="Enter call notes..."
              className="flex-1 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900"
              rows={2}
              required
            />
            <button
              type="submit"
              disabled={isSubmitting || !newCallNote.trim()}
              className="px-4 py-2 text-sm font-medium text-white bg-green-600 border border-transparent rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? "Adding..." : "Add Call"}
            </button>
          </div>
        </div>
      </form>

      {/* Error message */}
      {error && (
        <div className="mb-4 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md">
          {error}
        </div>
      )}

      {/* Call records list */}
      <div className="space-y-4">
        {isLoading ? (
          <div className="flex justify-center py-4">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
          </div>
        ) : callRecords.length === 0 ? (
          <p className="text-gray-500 text-center py-4">No call records yet.</p>
        ) : (
          callRecords.map((record, index) => (
            <div
              key={record._id || index}
              className="bg-gray-50 rounded-lg p-4 border-l-4 border-blue-500"
            >
              <div className="flex justify-between items-start mb-2">
                <div className="text-sm text-gray-500">
                  Call #{callRecords.length - index}
                </div>
                <div className="flex items-center space-x-2">
                  <div className="text-sm text-gray-500">
                    {formatDate(record.date)}
                  </div>
                  <div className="flex space-x-1">
                    <button
                      onClick={() => handleEditCall(record)}
                      className="text-blue-600 hover:text-blue-900 px-2 py-1 rounded hover:bg-blue-50 text-xs"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDeleteCall(record._id)}
                      className={`px-2 py-1 rounded text-xs ${
                        deleteConfirm === record._id
                          ? "text-white bg-red-600 hover:bg-red-700"
                          : "text-red-600 hover:text-red-900 hover:bg-red-50"
                      }`}
                    >
                      {deleteConfirm === record._id ? "Confirm" : "Delete"}
                    </button>
                    {deleteConfirm === record._id && (
                      <button
                        onClick={handleCancelEdit}
                        className="text-gray-600 hover:text-gray-900 px-2 py-1 rounded hover:bg-gray-50 text-xs"
                      >
                        Cancel
                      </button>
                    )}
                  </div>
                </div>
              </div>

              {editingCall === record._id ? (
                <div className="space-y-3">
                  <textarea
                    value={editNote}
                    onChange={(e) => setEditNote(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900"
                    rows={3}
                    required
                  />
                  <div className="flex justify-end space-x-2">
                    <button
                      onClick={handleCancelEdit}
                      className="px-3 py-1 text-sm text-gray-600 bg-gray-200 rounded hover:bg-gray-300"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={() => handleUpdateCall(record._id)}
                      disabled={isSubmitting || !editNote.trim()}
                      className="px-3 py-1 text-sm text-white bg-blue-600 rounded hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isSubmitting ? "Updating..." : "Update"}
                    </button>
                  </div>
                </div>
              ) : (
                <p className="text-gray-900 whitespace-pre-wrap">
                  {record.notes}
                </p>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}
