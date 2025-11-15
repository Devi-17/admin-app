'use client';

import { NotificationSubscription } from '../types';

/**
 * Initialize Web Push API
 */
export async function initializeWebPush(): Promise<NotificationSubscription | null> {
  if (typeof window === 'undefined') {
    return null;
  }

  if (!('serviceWorker' in navigator) || !('PushManager' in window)) {
    console.warn('This browser does not support Web Push');
    return null;
  }

  // Request permission
  const permission = await Notification.requestPermission();
  if (permission !== 'granted') {
    console.warn('Notification permission denied');
    return null;
  }

  // Register service worker
  let registration: ServiceWorkerRegistration;
  try {
    registration = await navigator.serviceWorker.ready;
  } catch (error) {
    console.error('Service Worker not ready:', error);
    return null;
  }

  // Subscribe to push
  const vapidKey = process.env.NEXT_PUBLIC_FCM_VAPID_KEY;
  if (!vapidKey) {
    console.warn('VAPID key not configured');
    return null;
  }

  try {
    const subscription = await registration.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey: urlBase64ToUint8Array(vapidKey) as BufferSource,
    });

    // Save subscription to server
    const subscriptionData = await saveWebPushSubscription(subscription);
    return subscriptionData;
  } catch (error) {
    console.error('Error subscribing to push:', error);
    return null;
  }
}

/**
 * Convert VAPID key to Uint8Array
 */
function urlBase64ToUint8Array(base64String: string): Uint8Array {
  const padding = '='.repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/');

  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);

  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
}

/**
 * Save Web Push subscription to server
 */
async function saveWebPushSubscription(
  subscription: PushSubscription
): Promise<NotificationSubscription | null> {
  try {
    const response = await fetch('/api/notifications/subscribe', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        type: 'webpush',
        endpoint: subscription.endpoint,
        keys: {
          p256dh: arrayBufferToBase64(subscription.getKey('p256dh')!),
          auth: arrayBufferToBase64(subscription.getKey('auth')!),
        },
      }),
    });

    if (!response.ok) {
      throw new Error('Failed to save subscription');
    }

    const data = await response.json();
    return data.subscription;
  } catch (error) {
    console.error('Error saving Web Push subscription:', error);
    return null;
  }
}

/**
 * Convert ArrayBuffer to Base64
 */
function arrayBufferToBase64(buffer: ArrayBuffer): string {
  const bytes = new Uint8Array(buffer);
  let binary = '';
  for (let i = 0; i < bytes.byteLength; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return window.btoa(binary);
}

/**
 * Unsubscribe from Web Push
 */
export async function unsubscribeWebPush(): Promise<void> {
  try {
    const registration = await navigator.serviceWorker.ready;
    const subscription = await registration.pushManager.getSubscription();
    
    if (subscription) {
      await subscription.unsubscribe();
      await fetch('/api/notifications/unsubscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ endpoint: subscription.endpoint }),
      });
    }
  } catch (error) {
    console.error('Error unsubscribing from Web Push:', error);
  }
}

