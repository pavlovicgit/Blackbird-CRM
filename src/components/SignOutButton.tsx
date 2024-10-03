"use client"
import { useRouter } from 'next/navigation';

const SignOutButton = () => {
    const router = useRouter();

    const handleSignOut = () => {
        localStorage.removeItem('token'); 
        localStorage.removeItem('email');
        
        router.push('/login');
    };

    return (
        <button onClick={handleSignOut} className="p-2 text-white bg-red-500 hover:bg-red-600 rounded-md  border-white">
            Sign Out
        </button>
    );
};

export default SignOutButton;
