"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

interface ProfileProps {
    className?: string;
}

const Profile = ({ className = '' }: ProfileProps) => {
    const [email, setEmail] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    useEffect(() => {
        const storedEmail = localStorage.getItem('email');
        if (storedEmail) {
            setEmail(storedEmail);
        } else {
            router.push('/login'); 
        }
        setLoading(false);
    }, [router]);

    return (
        <div className={`profile-container ${className}`}>
            <div className="w-full max-w-sm h-12 p-4 space-y-4 bg-white hover:cursor-pointer hover:bg-slate-50 shadow-md rounded-lg flex items-center justify-center">
               
                {!loading ? (
                    email ? (
                        <div className=" rounded-md">
                            <p className="text-gray-600"></p>
                            <button>
                                <Link href="/profile">
                                    <p className="text-blue-700 font-medium">{email}</p>
                                </Link>
                                </button>
                            
                        </div>
                    ) : (
                        <p>No profile data available</p>
                    )
                ) : (
                    <p>Loading...</p>
                )}
            </div>
        </div>
    );
};

export default Profile;
