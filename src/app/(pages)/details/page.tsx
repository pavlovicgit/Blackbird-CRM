"use client"
import { useAuth } from "@/components/useAuth";
import ClientDetails from "@/components/Details";

export default function DetailsPage() {
  useAuth();
  return <ClientDetails />;
}
