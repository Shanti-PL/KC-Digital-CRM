"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import AdminLoginForm from "@/components/AdminLoginForm";
import UserManagementForm from "@/components/UserManagementForm";
import { useAdmin } from "@/contexts/AdminContext";

export default function AdminPortal() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();
  const {
    admin,
    isAdminAuthenticated,
    isLoading: adminLoading,
    adminLogin,
    adminLogout,
  } = useAdmin();

  const [users, setUsers] = useState([]);
  const [isLoadingUsers, setIsLoadingUsers] = useState(false);
  const [showUserForm, setShowUserForm] = useState(false);
  const [formMode, setFormMode] = useState("create"); // "create", "edit", "reset-password"
  const [selectedUser, setSelectedUser] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState("");

  // 获取所有用户
  const fetchUsers = async () => {
    try {
      setIsLoadingUsers(true);
      const response = await fetch("/api/admin/users");
      const result = await response.json();

      if (result.success) {
        setUsers(result.data);
      } else {
        setError("Failed to fetch users");
      }
    } catch (error) {
      setError("Error connecting to server");
    } finally {
      setIsLoadingUsers(false);
    }
  };

  // 如果已认证，获取用户列表
  useEffect(() => {
    if (isAdminAuthenticated) {
      fetchUsers();
    }
  }, [isAdminAuthenticated]);

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

  // Handle user form submission
  const handleUserFormSubmit = async (formData) => {
    setIsSubmitting(true);
    setError("");
    setSuccess("");

    try {
      let url = "/api/admin/users";
      let method = "POST";

      if (formMode === "edit") {
        url = `/api/admin/users/${selectedUser._id}`;
        method = "PUT";
      } else if (formMode === "reset-password") {
        url = `/api/admin/users/${selectedUser._id}`;
        method = "PATCH";
      }

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const result = await response.json();

      if (result.success) {
        setSuccess(result.message || "Operation completed successfully");
        setShowUserForm(false);
        setSelectedUser(null);
        fetchUsers(); // Refresh the list
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

  // Handle delete user
  const handleDeleteUser = async (userId) => {
    if (
      !confirm(
        "Are you sure you want to delete this user? This action cannot be undone."
      )
    ) {
      return;
    }

    try {
      const response = await fetch(`/api/admin/users/${userId}`, {
        method: "DELETE",
      });

      const result = await response.json();

      if (result.success) {
        setSuccess("User deleted successfully");
        fetchUsers(); // Refresh the list
      } else {
        setError("Failed to delete user");
      }
    } catch (error) {
      setError("Error connecting to server");
    }
  };

  // Handle form actions
  const handleAddUser = () => {
    setFormMode("create");
    setSelectedUser(null);
    setShowUserForm(true);
    setError("");
    setSuccess("");
  };

  const handleEditUser = (user) => {
    setFormMode("edit");
    setSelectedUser(user);
    setShowUserForm(true);
    setError("");
    setSuccess("");
  };

  const handleResetPassword = (user) => {
    setFormMode("reset-password");
    setSelectedUser(user);
    setShowUserForm(true);
    setError("");
    setSuccess("");
  };

  const handleCancelForm = () => {
    setShowUserForm(false);
    setSelectedUser(null);
    setError("");
    setSuccess("");
  };

  const handleAdminLogin = async (credentials) => {
    setIsLoading(true);
    setError("");

    const result = await adminLogin(credentials);

    if (!result.success) {
      setError(result.error);
    }

    setIsLoading(false);
  };

  const handleLogout = () => {
    adminLogout();
  };

  // 显示加载状态
  if (adminLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-600"></div>
      </div>
    );
  }

  // 如果未认证，显示登录表单
  if (!isAdminAuthenticated) {
    return (
      <AdminLoginForm
        onSubmit={handleAdminLogin}
        isLoading={isLoading}
        error={error}
      />
    );
  }

  // 管理员后台界面
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-[#6138AE] shadow-sm">
        <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center">
              <h1 className="text-2xl font-bold text-white">KC Admin Portal</h1>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-red-100">
                Welcome, {admin?.username}
              </span>
              <button
                onClick={handleLogout}
                className="text-md font-semibold text-white hover:text-black hover:bg-white bg-black px-4 py-2 rounded transition-all duration-300"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="space-y-8">
          {/* System Overview */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              System Overview
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-blue-50 p-4 rounded-lg">
                <div className="text-2xl font-bold text-blue-600">
                  {users.length}
                </div>
                <div className="text-gray-600 text-sm">Total Users</div>
              </div>
              <div className="bg-green-50 p-4 rounded-lg">
                <div className="text-2xl font-bold text-green-600">Active</div>
                <div className="text-gray-600 text-sm">System Status</div>
              </div>
              <div className="bg-purple-50 p-4 rounded-lg">
                <div className="text-2xl font-bold text-purple-600">
                  MongoDB
                </div>
                <div className="text-gray-600 text-sm">Database</div>
              </div>
            </div>
          </div>

          {/* User Management */}
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold text-gray-900">
                User Management
              </h2>
              <div className="flex space-x-2">
                <button
                  onClick={handleAddUser}
                  className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
                >
                  Add User
                </button>
                <button
                  onClick={fetchUsers}
                  className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                >
                  Refresh
                </button>
              </div>
            </div>

            {error && (
              <div className="mb-4 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md">
                {error}
              </div>
            )}

            {success && (
              <div className="mb-4 bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-md">
                {success}
              </div>
            )}

            {isLoadingUsers ? (
              <div className="flex justify-center py-4">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Username
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Email
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Role
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Created At
                      </th>
                      <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {users.map((user) => (
                      <tr key={user._id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {user.username}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {user.email}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span
                            className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                              user.role === "admin"
                                ? "bg-red-100 text-red-800"
                                : "bg-blue-100 text-blue-800"
                            }`}
                          >
                            {user.role}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {new Date(user.createdAt).toLocaleDateString()}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <div className="flex justify-end space-x-2">
                            <button
                              onClick={() => handleEditUser(user)}
                              className="text-blue-600 hover:text-blue-900 px-2 py-1 rounded hover:bg-blue-50"
                            >
                              Edit
                            </button>
                            <button
                              onClick={() => handleResetPassword(user)}
                              className="text-orange-600 hover:text-orange-900 px-2 py-1 rounded hover:bg-orange-50"
                            >
                              Reset Password
                            </button>
                            <button
                              onClick={() => handleDeleteUser(user._id)}
                              className="text-red-600 hover:text-red-900 px-2 py-1 rounded hover:bg-red-50"
                            >
                              Delete
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>

                {users.length === 0 && (
                  <div className="text-center py-8 text-gray-500">
                    No users found
                  </div>
                )}
              </div>
            )}
          </div>

          {/* User Form */}
          {showUserForm && (
            <UserManagementForm
              user={selectedUser}
              onSubmit={handleUserFormSubmit}
              onCancel={handleCancelForm}
              isLoading={isSubmitting}
              mode={formMode}
            />
          )}

          {/* Instructions */}
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
            <h3 className="text-lg font-medium text-yellow-800 mb-2">
              User Management Instructions
            </h3>
            <div className="text-yellow-700 space-y-2">
              <p>
                • <strong>Add User</strong>: Create new users who can access the
                CRM system
              </p>
              <p>
                • <strong>Edit User</strong>: Update user information (username
                cannot be changed)
              </p>
              <p>
                • <strong>Reset Password</strong>: Set a new password for
                existing users
              </p>
              <p>
                • <strong>Delete User</strong>: Permanently remove users from
                the system
              </p>
              <p>
                • Users created here can login at <code>/auth/login</code> to
                access the CRM
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
