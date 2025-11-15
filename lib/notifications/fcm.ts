'use client';

import { getMessagingInstance, requestFCMToken, setupFCMListener } from '../firebase-client';
import { NotificationSubscription } from '../types';

/**
 * Initialize FCM and request permission
 */
export async function initializeFCM(): Promise<string | null> {
  if (typeof window === 'undefined') {
    return null;
  }

  if (!('Notification' in window)) {
    console.warn('This browser does not support notifications');
    return null;
  }

  // Request permission
  const permission = await Notification.requestPermission();
  if (permission !== 'granted') {
    console.warn('Notification permission denied');
    return null;
  }

  // Register service worker
  if ('serviceWorker' in navigator) {
    try {
      const registration = await navigator.serviceWorker.register('/firebase-messaging-sw.js');
      console.log('Service Worker registered:', registration);
    } catch (error) {
      console.error('Service Worker registration failed:', error);
      return null;
    }
  }

  // Get FCM token
  const token = await requestFCMToken();
  if (token) {
    // Save token to server
    await saveNotificationToken(token);
  }

  return token;
}

/**
 * Save FCM token to server
 */
async function saveNotificationToken(token: string): Promise<void> {
  try {
    const response = await fetch('/api/notifications/subscribe', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ token, type: 'fcm' }),
    });

    if (!response.ok) {
      throw new Error('Failed to save notification token');
    }
  } catch (error) {
    console.error('Error saving notification token:', error);
  }
}

/**
 * Set up FCM message handler
 */
export function setupFCMHandler(onMessage: (payload: any) => void): (() => void) | null {
  return setupFCMListener((payload) => {
    console.log('FCM message received:', payload);
    onMessage(payload);
  });
}

