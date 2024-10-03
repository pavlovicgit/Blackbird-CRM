"use client"
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

const withAuth = (WrappedComponent: React.ComponentType) => {
    const AuthHOC = (props: any) => {
        const router = useRouter();
        const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;

        useEffect(() => {
            if (!token) {
                router.push('/auth/login');
            }
        }, [token, router]);

        if (!token) {
            return <div>Loading...</div>; // or a loading spinner
        }

        return <WrappedComponent {...props} />;
    };

    return AuthHOC;
};

export default withAuth;
