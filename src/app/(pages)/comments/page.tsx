"use client";

import CommentTable from "@/components/CommentTable";
import { useAuth } from "@/components/useAuth";
import Profile from "@/components/Profile";

export default function CommentsPage() {
  useAuth();

  return (
    <div className="relative min-h-screen">
      <CommentTable />
      <Profile className="absolute top-4 right-4" />
    </div>
  );
}
