'use client';

import { AuthContext } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { useContext, useEffect } from 'react';

const withUserProtection = (WrappedComponent: React.ComponentType) => {
    return function ProtectedRoute(props: any) {
        const { isAuthenticated, user } = useContext(AuthContext);
        const router = useRouter();

        if (!isAuthenticated) {
            router.push('/login');
        }

        useEffect(() => {

            if (!isAuthenticated) {
                router.push('/login');
            }

        }, [isAuthenticated, user, router]);

        if (!isAuthenticated) {
            return null;
        }

        return <WrappedComponent {...props} />;
    };
};



export default withUserProtection;
