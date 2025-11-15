'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/lib/store/authStore';

export function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const { user, adminUser, loading } = useAuthStore();

  useEffect(() => {
    if (!loading && (!user || !adminUser)) {
      router.push('/login');
    }
  }, [user, adminUser, loading, router]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!user || !adminUser) {
    return null;
  }

  return <>{children}</>;
}

