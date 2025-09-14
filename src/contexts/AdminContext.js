"use client";

import { createContext, useContext, useEffect, useState } from "react";

const AdminContext = createContext();

export function useAdmin() {
  const context = useContext(AdminContext);
  if (!context) {
    throw new Error("useAdmin must be used within an AdminProvider");
  }
  return context;
}

export function AdminProvider({ children }) {
  const [admin, setAdmin] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check if admin is logged in on app start by calling verify API
    const verifyAdminToken = async () => {
      try {
        const response = await fetch("/api/admin/verify", {
          method: "GET",
          credentials: "include", // Include cookies in the request
        });

        const data = await response.json();

        if (data.success) {
          setAdmin(data.admin);
        } else {
          // Token is invalid or doesn't exist
          setAdmin(null);
        }
      } catch (error) {
        console.error("Admin token verification error:", error);
        setAdmin(null);
      } finally {
        setIsLoading(false);
      }
    };

    verifyAdminToken();
  }, []);

  const adminLogin = async (credentials) => {
    try {
      const response = await fetch("/api/admin/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(credentials),
      });

      const data = await response.json();

      if (data.success) {
        setAdmin(data.user);
        return { success: true };
      } else {
        return { success: false, error: data.error };
      }
    } catch (error) {
      return { success: false, error: "Network error" };
    }
  };

  const adminLogout = async () => {
    try {
      await fetch("/api/admin/logout", {
        method: "POST",
        credentials: "include", // Include cookies in the request
      });
    } catch (error) {
      console.error("Admin logout error:", error);
    } finally {
      setAdmin(null);
      // No need to manually remove cookies as the server handles it
    }
  };

  const value = {
    admin,
    isLoading,
    adminLogin,
    adminLogout,
    isAdminAuthenticated: !!admin,
  };

  return (
    <AdminContext.Provider value={value}>{children}</AdminContext.Provider>
  );
}
