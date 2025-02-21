// app/auth/signin/page.tsx
"use client";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function SignIn() {
  const { user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (user) router.push("/dashboard");
  }, [user, router]);

  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <button
        className="px-4 py-2 bg-blue-600 text-white rounded"
      >
        Sign In with Google
      </button>
    </div>
  );
}