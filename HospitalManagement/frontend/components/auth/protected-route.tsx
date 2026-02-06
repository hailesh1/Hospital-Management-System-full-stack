'use client';

import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { useAuth } from '@/contexts/auth-context';
import { Loader2 } from 'lucide-react';

type ProtectedRouteProps = {
  children: React.ReactNode;
  requiredRole?: 'admin' | 'doctor' | 'patient' | 'receptionist';
  redirectTo?: string;
};

export function ProtectedRoute({ children, requiredRole, redirectTo = '/login' }: ProtectedRouteProps) {
  const { user, isAuthenticated, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      // User is not authenticated, redirect to login
      router.push(redirectTo);
    } else if (!isLoading && isAuthenticated && requiredRole && user?.role !== requiredRole) {
      // User is authenticated but doesn't have the required role
      // Redirect to their dashboard or unauthorized page
      router.push(`/${user?.role}/dashboard`);
    }
  }, [isAuthenticated, isLoading, requiredRole, router, user, redirectTo]);

  if (isLoading || !isAuthenticated || (requiredRole && user?.role !== requiredRole)) {
    return (
      <div className="flex h-screen w-full items-center justify-center">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
      </div>
    );
  }

  return <>{children}</>;
}
