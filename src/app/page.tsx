"use client";

import Login from "./auth/login";
import Register from "./auth/register";
import SignOutButton from "@/components/SignOutButton";
import Profile from "@/components/Profile";

export default function Home() {
  return (
    <div className="relative min-h-screen">
      <div className=" items-center space-y-16 p-4">
        <Login />
      </div>
      <Profile className="absolute top-4 right-4" />
    </div>
  );
}
