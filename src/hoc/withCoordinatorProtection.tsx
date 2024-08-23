'use client';

import { useContext, useEffect } from 'react';
import { useRouter } from 'next/navigation'; 
import { AuthContext } from '@/contexts/AuthContext';

const withCoordinatorProtection = (WrappedComponent: React.ComponentType) => {
  return function ProtectedRoute(props: any) {
    const { isAuthenticated, user } = useContext(AuthContext);
    const router = useRouter();

    useEffect(() => {
      if (!isAuthenticated) {
        router.push('/login');

      } else if (!user?.roles.includes("COORDINATOR") && !user?.roles.includes("ADMIN")) {
        router.push('/not-found');
      }

    }, [isAuthenticated, user, router]);

    if (!isAuthenticated || (!user?.roles.includes("COORDINATOR") && !user?.roles.includes("ADMIN"))) {
      return null;
    }

    return <WrappedComponent {...props} />;
  };
};

export default withCoordinatorProtection;
