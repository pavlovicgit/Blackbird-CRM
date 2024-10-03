"use client"
import Register from "@/app/auth/register";
import { useAuth } from "@/components/useAuth";

export default function RegisterPage() {
  useAuth();
  return (
    <div>
      <Register />
    </div>
  );
};