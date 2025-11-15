'use client';

import { initializeFCM, setupFCMHandler } from './fcm';
import { initializeWebPush } from './webpush';

/**
 * Initialize all notification systems
 */
export async function initializeNotifications(): Promise<{
  fcmToken: string | null;
  webPushSubscription: any | null;
}> {
  const [fcmToken, webPushSubscription] = await Promise.all([
    initializeFCM(),
    initializeWebPush(),
  ]);

  return { fcmToken, webPushSubscription };
}

/**
 * Set up notification handlers
 */
export function setupNotificationHandlers(onNotification: (payload: any) => void): () => void {
  const unsubscribeFCM = setupFCMHandler(onNotification);

  // Set up service worker message handler for Web Push
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.addEventListener('message', (event) => {
      if (event.data && event.data.type === 'PUSH_NOTIFICATION') {
        onNotification(event.data.payload);
      }
    });
  }

  return () => {
    if (unsubscribeFCM) {
      unsubscribeFCM();
    }
  };
}

