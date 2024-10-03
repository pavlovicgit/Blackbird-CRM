"use client";

import ProjectTable from "@/components/ProjectTable";
import { useAuth } from "@/components/useAuth";
import Profile from "@/components/Profile";

export default function ProjectsPage() {
  useAuth();

  return (
    <div className="relative min-h-screen">
      <ProjectTable />
      <Profile className="absolute top-4 right-4" />
    </div>
  );
}
