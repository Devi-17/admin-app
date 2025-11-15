'use client';

import { initializeApp, getApps, FirebaseApp } from 'firebase/app';
import { getAuth, Auth, connectAuthEmulator } from 'firebase/auth';
import { getFirestore, Firestore, connectFirestoreEmulator } from 'firebase/firestore';
import { getMessaging, Messaging, getToken, onMessage } from 'firebase/messaging';

let firebaseApp: FirebaseApp | null = null;
let firebaseAuth: Auth | null = null;
let firebaseDb: Firestore | null = null;
let messaging: Messaging | null = null;

// Firebase configuration for admin app (new Firebase project)
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_ADMIN_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_ADMIN_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_ADMIN_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_ADMIN_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_ADMIN_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_ADMIN_APP_ID,
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_ADMIN_MEASUREMENT_ID,
};

/**
 * Initialize Firebase App (client-side)
 */
export function getFirebaseApp(): FirebaseApp {
  if (firebaseApp) {
    return firebaseApp;
  }

  const existingApps = getApps();
  if (existingApps.length > 0) {
    firebaseApp = existingApps[0];
    return firebaseApp;
  }

  // Validate config
  const requiredKeys = ['apiKey', 'authDomain', 'projectId', 'appId'];
  const missing = requiredKeys.filter((k) => !firebaseConfig[k as keyof typeof firebaseConfig]);
  
  if (missing.length > 0) {
    throw new Error(
      `Firebase configuration is missing required fields: ${missing.join(', ')}`
    );
  }

  firebaseApp = initializeApp(firebaseConfig);
  return firebaseApp;
}

/**
 * Get Firebase Auth instance
 */
export function getFirebaseAuth(): Auth {
  if (firebaseAuth) {
    return firebaseAuth;
  }

  const app = getFirebaseApp();
  firebaseAuth = getAuth(app);

  // Connect to emulator in development if needed
  if (process.env.NODE_ENV === 'development' && process.env.NEXT_PUBLIC_USE_EMULATOR === 'true') {
    try {
      connectAuthEmulator(firebaseAuth, 'http://localhost:9099', { disableWarnings: true });
    } catch (error) {
      // Emulator already connected
    }
  }

  return firebaseAuth;
}

/**
 * Get Firestore instance (client-side - for admin app data only)
 * Note: Main Firestore operations use Admin SDK
 */
export function getFirebaseDb(): Firestore {
  if (firebaseDb) {
    return firebaseDb;
  }

  const app = getFirebaseApp();
  firebaseDb = getFirestore(app);

  // Connect to emulator in development if needed
  if (process.env.NODE_ENV === 'development' && process.env.NEXT_PUBLIC_USE_EMULATOR === 'true') {
    try {
      connectFirestoreEmulator(firebaseDb, 'localhost', 8080);
    } catch (error) {
      // Emulator already connected
    }
  }

  return firebaseDb;
}

/**
 * Get Firebase Cloud Messaging instance
 */
export function getMessagingInstance(): Messaging | null {
  if (typeof window === 'undefined') {
    return null; // FCM only works in browser
  }

  if (messaging) {
    return messaging;
  }

  try {
    const app = getFirebaseApp();
    messaging = getMessaging(app);
    return messaging;
  } catch (error) {
    console.error('Error initializing FCM:', error);
    return null;
  }
}

/**
 * Request FCM token for push notifications
 */
export async function requestFCMToken(): Promise<string | null> {
  if (typeof window === 'undefined') {
    return null;
  }

  const messagingInstance = getMessagingInstance();
  if (!messagingInstance) {
    return null;
  }

  const vapidKey = process.env.NEXT_PUBLIC_FCM_VAPID_KEY;
  if (!vapidKey) {
    console.warn('FCM VAPID key not configured');
    return null;
  }

  try {
    const token = await getToken(messagingInstance, { vapidKey });
    return token;
  } catch (error) {
    console.error('Error getting FCM token:', error);
    return null;
  }
}

/**
 * Set up FCM message handler
 */
export function setupFCMListener(callback: (payload: any) => void): (() => void) | null {
  if (typeof window === 'undefined') {
    return null;
  }

  const messagingInstance = getMessagingInstance();
  if (!messagingInstance) {
    return null;
  }

  try {
    return onMessage(messagingInstance, callback);
  } catch (error) {
    console.error('Error setting up FCM listener:', error);
    return null;
  }
}

