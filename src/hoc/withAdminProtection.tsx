'use client';

import { useContext, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { AuthContext } from '@/contexts/AuthContext';

const withAdminProtection = (WrappedComponent: React.ComponentType) => {
    return function ProtectedRoute(props: any) {
        const { isAuthenticated, user } = useContext(AuthContext);
        const router = useRouter();

        useEffect(() => {

            if (!user?.roles.includes("ADMIN") || user === null) {
                router.push('/not-found');

            } else if (!isAuthenticated) {
                router.push('/login');
            }

        }, [isAuthenticated, user, router]);

        if (!isAuthenticated || !user?.roles.includes("ADMIN")) {
            return null;
        }
        return <WrappedComponent {...props} />;
    };
};

export default withAdminProtection;
