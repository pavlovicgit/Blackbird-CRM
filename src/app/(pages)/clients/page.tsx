"use client";

import ClientTable from "@/components/ClientTable";
import { useAuth } from "@/components/useAuth";
import Profile from "@/components/Profile";

export default function ClientsPage() {
  useAuth();

  return (
    <div className="relative min-h-screen">
      <ClientTable />
      <Profile className="absolute top-4 right-4" />
    </div>
  );
}