'use client';

import { useEffect } from 'react';
import { useAuthStore } from '@/lib/store/authStore';

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const initialize = useAuthStore((state) => state.initialize);

  useEffect(() => {
    const unsubscribe = initialize();
    return () => {
      if (unsubscribe) {
        unsubscribe();
      }
    };
  }, [initialize]);

  return <>{children}</>;
}

