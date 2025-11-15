import { initializeApp, cert, getApps, App } from 'firebase-admin/app';
import { getFirestore, Firestore } from 'firebase-admin/firestore';
import { getAuth, Auth } from 'firebase-admin/auth';

let adminApp: App | null = null;
let adminDb: Firestore | null = null;
let adminAuth: Auth | null = null;

/**
 * Initialize Firebase Admin SDK with service account credentials
 * Connects to the existing Firestore database
 */
export function getFirebaseAdminApp(): App {
  if (adminApp) {
    return adminApp;
  }

  // Only initialize in server-side runtime, not during build
  if (typeof window !== 'undefined') {
    throw new Error('Firebase Admin SDK can only be used server-side');
  }

  const projectId = process.env.FIREBASE_SERVICE_ACCOUNT_PROJECT_ID;
  const clientEmail = process.env.FIREBASE_SERVICE_ACCOUNT_CLIENT_EMAIL;
  const privateKey = process.env.FIREBASE_SERVICE_ACCOUNT_PRIVATE_KEY?.replace(/\\n/g, '\n');

  if (!projectId || !clientEmail || !privateKey) {
    // During build time, don't throw - let runtime handle it
    // This allows Next.js to build without env vars
    const error = new Error(
      'Missing Firebase service account credentials. Please set FIREBASE_SERVICE_ACCOUNT_PROJECT_ID, FIREBASE_SERVICE_ACCOUNT_CLIENT_EMAIL, and FIREBASE_SERVICE_ACCOUNT_PRIVATE_KEY environment variables.'
    );
    // Only throw in production runtime, not during build
    if (process.env.NEXT_PHASE !== 'phase-production-build') {
      throw error;
    }
    // During build, return null to allow build to complete
    return null as any;
  }

  // Check if app already exists
  const existingApps = getApps();
  if (existingApps.length > 0) {
    adminApp = existingApps[0];
    return adminApp;
  }

  try {
    adminApp = initializeApp({
      credential: cert({
        projectId,
        clientEmail,
        privateKey,
      }),
      projectId,
    });

    return adminApp;
  } catch (error) {
    console.error('Error initializing Firebase Admin:', error);
    throw error;
  }
}

/**
 * Get Firestore instance (connects to existing database)
 */
export function getFirebaseAdminDb(): Firestore {
  if (adminDb) {
    return adminDb;
  }

  const app = getFirebaseAdminApp();
  adminDb = getFirestore(app);
  return adminDb;
}

/**
 * Get Firebase Auth instance (for admin user management)
 */
export function getFirebaseAdminAuth(): Auth {
  if (adminAuth) {
    return adminAuth;
  }

  const app = getFirebaseAdminApp();
  adminAuth = getAuth(app);
  return adminAuth;
}

