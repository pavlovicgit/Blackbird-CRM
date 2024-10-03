"use client"
import Login from "@/app/auth/login";
import { useAuth } from "@/components/useAuth";

export default function LoginPage() {
  useAuth();
  return (
    <div>
      <Login />
    </div>
  );
};

