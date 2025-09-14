"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import AuthForm from "@/components/AuthForm";
import { useAuth } from "@/contexts/AuthContext";

export default function LoginPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();
  const { login } = useAuth();

  const handleLogin = async (credentials) => {
    setIsLoading(true);
    setError("");

    const result = await login(credentials);

    if (result.success) {
      router.push("/");
    } else {
      setError(result.error);
    }

    setIsLoading(false);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-md">
        {error && (
          <div className="mb-4 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md">
            {Array.isArray(error) ? error.join(", ") : error}
          </div>
        )}

        <AuthForm mode="login" onSubmit={handleLogin} isLoading={isLoading} />

        <div className="text-center mt-6">
          <p className="text-gray-500 text-sm">
            Need access? Contact your administrator.
          </p>
        </div>
      </div>
    </div>
  );
}
