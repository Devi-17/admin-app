'use client';

import { useEffect, useState } from 'react';
import { useAuthStore } from '@/lib/store/authStore';
import { initializeNotifications, setupNotificationHandlers } from '@/lib/notifications';
import { toast } from 'react-hot-toast';

export function NotificationProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuthStore();
  const [initialized, setInitialized] = useState(false);

  useEffect(() => {
    if (!user || initialized) return;

    const setupNotifications = async () => {
      try {
        await initializeNotifications();
        setInitialized(true);

        // Set up notification handlers
        setupNotificationHandlers((payload) => {
          console.log('Notification received:', payload);
          
          // Show toast notification
          toast.success(payload.notification?.title || 'New notification');

          // Update badge if supported
          if ('setAppBadge' in navigator) {
            navigator.setAppBadge(1);
          }
        });
      } catch (error) {
        console.error('Error initializing notifications:', error);
      }
    };

    setupNotifications();
  }, [user, initialized]);

  return <>{children}</>;
}

