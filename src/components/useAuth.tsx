// useAuth.tsx
"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export const useAuth = () => {
  const [token, setToken] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    setToken(storedToken);

    const publicPaths = ["/login", "/register"];

    const currentPath = window.location.pathname;

    if (!storedToken && !publicPaths.includes(currentPath)) {
      router.push("/login");
    }
  }, [router]);

  const login = async (username: string, password: string) => {
    try {
      const response = await fetch("http://localhost:5034/api/authentication/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, password }),
      });

      if (!response.ok) {
        throw new Error("Invalid credentials");
      }

      const data = await response.json();
      localStorage.setItem("token", data.token);
      setToken(data.token);
      router.push("/clients"); 
    } catch (error) {
      console.error("Failed to login:", error);
      alert("Invalid credentials");
    }
  };

  return {
    token,
    login,
  };
};
