"use client";

import Profile from "@/components/Profile";
import SignOutButton from "@/components/SignOutButton";

const LoginPage = () => {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 ">
      <div className="flex flex-col space-y-8 p-8 items-center justify-center bg-white shadow-md rounded-lg h-[300px] w-[300px]">
        <span className="text-xl font-medium text-black">Your Profile</span>
        <Profile />
        <SignOutButton />
      </div>
    </div>
  );
};

export default LoginPage;
