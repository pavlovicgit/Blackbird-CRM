"use client"
import { useAuth } from "@/components/useAuth";
import ProjectDetails from "@/components/project-details";

export default function ProjectDetailsPage() {
  useAuth();
  return <ProjectDetails />;
}
